export type AICommand = {
    action: 'addTask' | 'updateTask' | 'deleteTask'
    [key: string]: any
}

export function parseCommand(response: string): AICommand | null {
    // Match [COMMAND:{...}]
    // [\s\S]*? ensures we capture newlines inside the JSON
    const commandMatch = response.match(/\[COMMAND:([\s\S]*?)\]/)

    if (!commandMatch) return null

    try {
        const jsonStr = commandMatch[1]
        const parsed = JSON.parse(jsonStr)

        // Basic validation
        if (!parsed.action) return null

        return parsed as AICommand
    } catch {
        return null
    }
}
