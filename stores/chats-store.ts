import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { AIChatThread, AIChatMessage } from './types';

interface ChatsStoreState {
    // Core State - indexed by project_id
    chatsByProject: Record<string, AIChatThread[]>;
    messagesByThread: Record<string, AIChatMessage[]>;
    activeThreadId: string | null;

    // Backend sync
    loadChatHistoryFromBackend: (projectId: string) => Promise<void>;

    // Chat Management Methods
    startNewChat: (projectId: string, title?: string) => string;
    deleteChat: (threadId: string) => void;
    openChat: (threadId: string) => void;
    sendMessage: (threadId: string, content: string, role: 'user' | 'assistant', userId?: string) => string;

    // Project Sync Methods
    getChatsForProject: (projectId: string) => AIChatThread[];
    getMessagesForThread: (threadId: string) => AIChatMessage[];
    clearChatsForProject: (projectId: string) => void;

    // Utility Methods
    getActiveThread: () => AIChatThread | null;
    getActiveMessages: () => AIChatMessage[];
    setActiveThreadFromProject: (projectId: string) => void;

    // Thread Management
    updateThreadTitle: (threadId: string, title: string) => void;
    getThreadCount: (projectId: string) => number;
}

const generateChatTitle = (messageCount: number): string => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    return `New Chat ${timestamp}`;
};

const useChatsStore = create<ChatsStoreState>()(
    persist(
        (set, get) => ({
            chatsByProject: {},
            messagesByThread: {},
            activeThreadId: null,

            // Load chat history from backend
            loadChatHistoryFromBackend: async (projectId: string) => {
                try {
                    const response = await fetch(`/api/projects/${projectId}/chat`);
                    if (!response.ok) {
                        console.error('[Chats Store] Failed to load chat history:', response.status);
                        return;
                    }

                    const { messages } = await response.json();
                    
                    if (!messages || messages.length === 0) {
                        console.log('[Chats Store] No chat history found for project');
                        return;
                    }

                    // Create a single thread for all project messages (since DB doesn't use threads yet)
                    const state = get();
                    const existingChats = state.chatsByProject[projectId] || [];
                    
                    // Check if we already have a thread for this project
                    if (existingChats.length === 0) {
                        // Create new thread
                        const threadId = uuidv4();
                        const newThread: AIChatThread = {
                            id: threadId,
                            project_id: projectId,
                            title: 'Chat History',
                            created_by: messages[0]?.created_by || 'unknown',
                            created_at: messages[0]?.created_at || new Date().toISOString(),
                            updated_at: messages[messages.length - 1]?.created_at || new Date().toISOString()
                        };

                        // Map backend messages to frontend format
                        const mappedMessages: AIChatMessage[] = messages.map((msg: any) => ({
                            id: msg.id,
                            thread_id: threadId,
                            role: msg.role,
                            content: msg.content,
                            metadata: null,
                            created_by: msg.created_by
                        }));

                        set({
                            chatsByProject: {
                                ...state.chatsByProject,
                                [projectId]: [newThread]
                            },
                            messagesByThread: {
                                ...state.messagesByThread,
                                [threadId]: mappedMessages
                            },
                            activeThreadId: threadId
                        });

                        console.log(`[Chats Store] Loaded ${messages.length} messages from backend`);
                    }
                } catch (error) {
                    console.error('[Chats Store] Error loading chat history:', error);
                }
            },

            startNewChat: (projectId: string, title?: string) => {
                const state = get();
                const existingChats = state.chatsByProject[projectId] || [];
                const threadId = uuidv4();

                const newThread: AIChatThread = {
                    id: threadId,
                    project_id: projectId,
                    title: title || generateChatTitle(existingChats.length),
                    created_by: 'local-user', // TODO: Replace with actual user ID when auth is implemented
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                set({
                    chatsByProject: {
                        ...state.chatsByProject,
                        [projectId]: [...existingChats, newThread]
                    },
                    messagesByThread: {
                        ...state.messagesByThread,
                        [threadId]: []
                    },
                    activeThreadId: threadId
                });

                return threadId;
            },

            deleteChat: (threadId: string) => {
                const state = get();
                const updatedChatsByProject = { ...state.chatsByProject };
                const updatedMessagesByThread = { ...state.messagesByThread };

                // Find and remove the thread from the appropriate project
                Object.keys(updatedChatsByProject).forEach(projectId => {
                    updatedChatsByProject[projectId] = updatedChatsByProject[projectId].filter(
                        thread => thread.id !== threadId
                    );
                });

                // Remove all messages for this thread
                delete updatedMessagesByThread[threadId];

                // Clear active thread if it's the one being deleted
                const newActiveThreadId = state.activeThreadId === threadId ? null : state.activeThreadId;

                set({
                    chatsByProject: updatedChatsByProject,
                    messagesByThread: updatedMessagesByThread,
                    activeThreadId: newActiveThreadId
                });
            },

            openChat: (threadId: string) => {
                set({ activeThreadId: threadId });
            },

            sendMessage: (threadId: string, content: string, role: 'user' | 'assistant', userId?: string) => {
                const state = get();
                const messageId = uuidv4();
                const existingMessages = state.messagesByThread[threadId] || [];

                const newMessage: AIChatMessage = {
                    id: messageId,
                    thread_id: threadId,
                    role,
                    content: content.trim(),
                    metadata: null,
                    created_by: role === 'user' ? (userId || 'local-user') : null
                };

                // Update messages
                const updatedMessagesByThread = {
                    ...state.messagesByThread,
                    [threadId]: [...existingMessages, newMessage]
                };

                // Update thread's updated_at timestamp
                const updatedChatsByProject = { ...state.chatsByProject };
                Object.keys(updatedChatsByProject).forEach(projectId => {
                    updatedChatsByProject[projectId] = updatedChatsByProject[projectId].map(thread =>
                        thread.id === threadId
                            ? { ...thread, updated_at: new Date().toISOString() }
                            : thread
                    );
                });

                set({
                    messagesByThread: updatedMessagesByThread,
                    chatsByProject: updatedChatsByProject
                });

                return messageId;
            },

            getChatsForProject: (projectId: string) => {
                const state = get();
                return state.chatsByProject[projectId] || [];
            },

            getMessagesForThread: (threadId: string) => {
                const state = get();
                return state.messagesByThread[threadId] || [];
            },

            clearChatsForProject: (projectId: string) => {
                const state = get();
                const threadsToDelete = state.chatsByProject[projectId] || [];
                const updatedChatsByProject = { ...state.chatsByProject };
                const updatedMessagesByThread = { ...state.messagesByThread };

                // Remove project's chats
                delete updatedChatsByProject[projectId];

                // Remove all messages for threads in this project
                threadsToDelete.forEach(thread => {
                    delete updatedMessagesByThread[thread.id];
                });

                // Clear active thread if it belongs to this project
                const newActiveThreadId = threadsToDelete.some(t => t.id === state.activeThreadId)
                    ? null
                    : state.activeThreadId;

                set({
                    chatsByProject: updatedChatsByProject,
                    messagesByThread: updatedMessagesByThread,
                    activeThreadId: newActiveThreadId
                });
            },

            getActiveThread: () => {
                const state = get();
                if (!state.activeThreadId) return null;

                // Find the thread across all projects
                for (const projectChats of Object.values(state.chatsByProject)) {
                    const thread = projectChats.find(t => t.id === state.activeThreadId);
                    if (thread) return thread;
                }
                return null;
            },

            getActiveMessages: () => {
                const state = get();
                if (!state.activeThreadId) return [];
                return state.messagesByThread[state.activeThreadId] || [];
            },

            setActiveThreadFromProject: (projectId: string) => {
                const state = get();
                const projectChats = state.chatsByProject[projectId] || [];

                // If there are existing chats for this project, set the most recent one as active
                if (projectChats.length > 0) {
                    // Sort by updated_at descending to get the most recent first
                    const sortedChats = [...projectChats].sort((a, b) =>
                        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    );
                    set({ activeThreadId: sortedChats[0].id });
                } else {
                    // No chats for this project, clear active thread
                    set({ activeThreadId: null });
                }
            },

            updateThreadTitle: (threadId: string, title: string) => {
                const state = get();
                const updatedChatsByProject = { ...state.chatsByProject };

                Object.keys(updatedChatsByProject).forEach(projectId => {
                    updatedChatsByProject[projectId] = updatedChatsByProject[projectId].map(thread =>
                        thread.id === threadId
                            ? {
                                ...thread,
                                title: title.trim(),
                                updated_at: new Date().toISOString()
                            }
                            : thread
                    );
                });

                set({ chatsByProject: updatedChatsByProject });
            },

            getThreadCount: (projectId: string) => {
                const state = get();
                return (state.chatsByProject[projectId] || []).length;
            }
        }),
        {
            name: 'chats-store'
        }
    )
);

export default useChatsStore;