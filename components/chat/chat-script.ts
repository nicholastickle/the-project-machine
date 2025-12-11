// Sprint 2: Scripted conversation for user testing
// This is the 8-cell storyboard flow

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  delay?: number // ms delay before showing (for AI messages)
  needsConfirmation?: boolean // Shows "Confirm" button after this message
  hasRisk?: boolean // Highlights this as a risky assumption
}

export const CHAT_SCRIPT: ChatMessage[] = [
  // Step 1: User's initial input (pre-filled) - MORE DETAILED
  {
    id: 'user-1',
    role: 'user',
    content: 'I need to design a bridge foundation for a highway overpass project. It\'s a 4-span continuous bridge crossing a river valley. The site has mixed soil conditions - clay on one bank, sandy soil on the other. We need to handle AASHTO HL-93 truck loads plus seismic requirements for Zone 3. Timeline is tight - construction starts in 8 months.',
  },
  
  // Step 2: AI acknowledges and asks follow-up
  {
    id: 'ai-1',
    role: 'ai',
    content: 'Thanks for the details. Let me confirm what I understand:\n\n• 4-span continuous bridge over river valley\n• Mixed soil: clay vs sandy conditions\n• Design loads: AASHTO HL-93 + Seismic Zone 3\n• 8-month timeline to construction\n\nBefore I create a plan, a few quick questions:\n\n1. Do you have geotechnical reports already?\n2. What\'s the approximate span length?\n3. Any environmental/permitting constraints?',
    delay: 1200,
  },
  
  // Step 3: User provides more details
  {
    id: 'user-2',
    role: 'user',
    content: 'Geotech reports from 2 years ago exist but may need updating. Spans are roughly 40m each. Yes - we need environmental clearance for river crossing and there\'s a protected wetland on the south bank.',
    delay: 1500, // Simulate user thinking/typing time
  },
  
  // Step 4: AI proposes comprehensive plan (12 tasks)
  {
    id: 'ai-2',
    role: 'ai',
    content: 'Perfect. Based on this scope, here\'s a comprehensive foundation design plan with 12 major tasks:\n\n**Phase 1: Investigation & Analysis (6 weeks)**\n\n1. Site Investigation & Geotech Update (80 hours)\n   - Review existing reports\n   - Supplementary borings\n   - Lab testing for updated parameters\n\n2. Geotechnical Engineering Report (40 hours)\n   - Soil profile analysis\n   - Foundation recommendations\n   - Seismic site classification\n\n3. Load Analysis & Modeling (60 hours)\n   - AASHTO HL-93 load cases\n   - Seismic load calculations (Zone 3)\n   - Load combinations per code\n\n**Phase 2: Foundation Design (8 weeks)**\n\n4. Foundation Type Selection (32 hours)\n   - ⚠️ RISKY ASSUMPTION: Deep foundation required - We\'re assuming soil won\'t support shallow spread footings. If wrong, this drives up cost 40-60%. Need early geotech confirmation.\n   - Pile vs drilled shaft comparison\n   - Cost-benefit analysis\n\n5. Foundation Capacity Analysis (56 hours)\n   - Axial capacity calculations\n   - Lateral load analysis\n   - Group effects\n\n6. Structural Foundation Design (72 hours)\n   - Pile cap design\n   - Reinforcement details\n   - Connection to superstructure\n\n**Phase 3: Analysis & Verification (6 weeks)**\n\n7. Finite Element Modeling (64 hours)\n   - 3D foundation model\n   - Soil-structure interaction\n   - Load distribution analysis\n\n8. Seismic Design & Detailing (48 hours)\n   - Response spectrum analysis\n   - Ductile detailing\n   - Liquefaction assessment\n\n9. Code Compliance Review (40 hours)\n   - AASHTO LRFD verification\n   - Local code requirements\n   - Peer review preparation\n\n**Phase 4: Documentation & Permitting (4 weeks)**\n\n10. Construction Drawings (96 hours)\n    - Foundation plans\n    - Pile details\n    - Reinforcement schedules\n\n11. Technical Specifications (56 hours)\n    - Material specs\n    - Construction procedures\n    - Quality control requirements\n\n12. Environmental & Permit Documentation (40 hours)\n    - Wetland impact assessment\n    - River crossing permits\n    - Agency submittals\n\n**Total: ~684 hours over 24 weeks**\n\nShall I add these tasks to your canvas so you can start organizing the work?',
    delay: 2500,
    needsConfirmation: true,
    hasRisk: true,
  },
]

export const INITIAL_MESSAGE = CHAT_SCRIPT[0].content
