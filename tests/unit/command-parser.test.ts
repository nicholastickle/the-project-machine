import { describe, it, expect } from 'vitest'
import { parseCommand } from '@/lib/ai/command-parser'

describe('AI Command Parser', () => {
    it('returns null for plain text', () => {
        const text = 'Hello world'
        expect(parseCommand(text)).toBeNull()
    })

    it('extracts valid command', () => {
        const text = 'Sure! [COMMAND:{"action":"addTask","title":"Test Task"}]'
        const result = parseCommand(text)
        expect(result).toEqual({
            action: 'addTask',
            title: 'Test Task'
        })
    })

    it('handles multiline JSON', () => {
        const text = `Here you go:
[COMMAND:{
  "action": "addTask",
  "title": "Multiline"
}]`
        const result = parseCommand(text)
        expect(result).toEqual({
            action: 'addTask',
            title: 'Multiline'
        })
    })

    it('returns null for invalid JSON', () => {
        const text = '[COMMAND:{bad json}]'
        expect(parseCommand(text)).toBeNull()
    })

    it('returns null if command has no action', () => {
        const text = '[COMMAND:{"title":"No Action"}]'
        expect(parseCommand(text)).toBeNull()
    })
})
