// Sprint 2: Scripted conversation for user testing
// Updated with final conversation flow from design sprint

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  delay?: number // ms delay before showing (for AI messages)
  needsConfirmation?: boolean // Shows "Confirm" button after this message
  hasRisk?: boolean // Highlights this as a risky assumption
}

export const CHAT_SCRIPT: ChatMessage[] = [
  {
    id: 'user-1',
    role: 'user',
    content: "Hey Project Machine. I am about to start a new project at work. It's a technical design of a highway bridge. I need to come up with a robust plan for this.",
  },
  
  {
    id: 'ai-1',
    role: 'ai',
    content: "Hey you!... Well lock in. You know that there are hundreds of tasks that go into planning a technical bridge design from scratch! We've got this though… let's take it step by step… Let's start with clarifying a bit more detail.\n\n**Disclaimer:** Just remember, my predictions are as good as your stored history, my training data, and info from the web. There will be inaccuracies. So the more you plan with me, the better I will get.\n\nWhat is the stage of the project? Conceptual? Preliminary? Or Detailed Design? This matters because plans get more granular the closer you get to the final design.",
    delay: 1500,
  },
  
  {
    id: 'user-2',
    role: 'user',
    content: "Detailed Design Project",
  },
  
  {
    id: 'ai-2',
    role: 'ai',
    content: "What is your overall experience with this kind of work? Entry level / Mid / Expert?",
    delay: 1000,
  },
  
  {
    id: 'user-3',
    role: 'user',
    content: "Entry level",
  },
  
  {
    id: 'ai-3',
    role: 'ai',
    content: "Okay, I need a better description of the bridge to start to gauge how much work this bridge is going to be. This is usually detailed in the bridge design report determined in prelim design. Or maybe you have the architectural description of the bridge. Think number of spans and piers, abutment types, bridge furniture, expansion joints, services carried by the bridge. Everything! Give as much detail as you can. Would also be good to know overall sizes and what the bridge is supporting, and what's going underneath it. What country is this in? What is the climate like? The more info you give me the better.",
    delay: 1500,
  },
  
  {
    id: 'user-4',
    role: 'user',
    content: "This is a single span bridge. With two lanes of traffic, and a pedestrian walkway either side. There are no piers. Only abutments. Integral abutments (so no bearings). The span length is about 20 metres. We are spanning over two lanes of traffic and a pedestrian sidewalk each side. On the bridge we have bridge parapets (concrete) that have endblocks, we have earwalls for the abutments. One one each side of the abutments. The deck type is a beam and slab bridge type with precast beams. There are some pipes within the sidewalk to carry other discipline's infrastructure. There is no lighting on the bridge. The bridge will also have some lighting and signage attached to the bridge. The country is the UK. The bridge is in London. So we'll be using Eurocode. The bridge foundations are concrete piles which are integral with the abutment.",
  },
  
  {
    id: 'ai-4',
    role: 'ai',
    content: "Lets go over some risks for our plan… technical bridge designs are multi-disciplinary projects, so you're likely going to have interfaces with many different disciplines. So a couple of potential risks. I will add some time for looking into these.\n\n• The list of to-dos are quite large and I may forget about many of them.\n• Is the highway design frozen? Which could radically mess up your design if you get too far.\n• Do you have accurate geotechnical design information for each of the foundation positions?\n• What are the details of the utilities that the structure is carrying? Do you know if that design is frozen or still to be done?\n• Do you have any budget constraints that limit the amount of design time you have? What is your design timeline?\n• How familiar are you with all of the client's design standards and requirements.\n• How familiar are you with the design codes you'll be using?\n• Do you have a decent technical reviewer who you are teaming up with?\n• Do you have asbuilt drawings of similar bridges you can reference?\n• Have the vertical clearances been confirmed?\n• How familiar are you with the structural analysis software you want to use? Risks associated with this?\n\nDo you want to change any of the above risks or have any more risks?",
    delay: 2000,
    hasRisk: true,
  },
  
  {
    id: 'user-5',
    role: 'user',
    content: "Can you remove the one about vertical clearances cause this has already been checked. Please also add a risk that the client doesn't yet know if there is lighting to be added on to the bridge.",
  },
  
  {
    id: 'ai-5',
    role: 'ai',
    content: "What percentage of contingency do you want to add for incase the estimates are too low and there are further unforeseen risks. Say 10%?",
    delay: 1000,
  },
  
  {
    id: 'user-6',
    role: 'user',
    content: "Yes 10% is fine.",
  },
  
  {
    id: 'ai-6',
    role: 'ai',
    content: "Here are the main tasks and their subtasks with estimated durations.\n\n**Task 1: General Research**\nDescription: Upfront research needed to reduce risk and plan better\n\n• Read Approval in Principal and note all requirements - **0.5 days**\n• Study design codes and note every design item you'll need to consider - **2 days**\n• Study the designs of other disciplines and determine if there are additional tasks - **1 day**\n• Check the geotech design and ensure you have all the info you need - **0.5 days**\n• Check that your allowable budget and schedule lines up with your plan - **0.2 days**\n• Study client requirements, standards, codes, drawings and determine any additional activities required - **2 days**\n• Detailed discussion with your reviewer and technical lead to discuss your plan and further plan for potential risks - **0.5 days**\n• Learning how to use structural analysis software needed for the design - **5 days**\n• Reviewing previous design calcs to fully appreciate level of effort required - **1 day**\n• Durability assessment report and concrete cover determination - **2 days**\n\n**Task 2: Initial sizing and bridge element determination**\nDescription: Prelim determination of geometry and what elements will make up the bridge. We do this to gain an appreciation for everything that the bridge must encompass.\n\n• Determine the vertical and horizontal clearances - **0.2 days**\n• Determine prelim deck thickness, span lengths, heights, and every other geometry you can think of - **1 day**\n• Prelim determine the parapet type, expansion joint type, bearings, utility supports, and any other kind of furniture - **1 day**\n• Create a simple BIM model or drawing to help work out all the geometries for the structural analysis - **2 days**\n\n**Task 3: Calculation of loads**\nDescription: Determine load types applicable to the structure.\n\n• Bridge self-weight loading - **0.3 days**\n• Asphalt loading - **0.1 days**\n• Edge barriers loading - **0.1 days**\n• Traffic loading - **0.5 days**\n• Earth pressure loading - **0.2 days**\n• Loading as a result of temperature effects - **0.2 days**\n• Earthquake loading - **0.2 days**\n• Wind loading - **0.2 days**\n• Accidental impact loading - **0.3 days**\n• Breaking loading - **0.2 days**\n• Skidding loading - **0.2 days**\n• Centrifugal loading - **0.2 days**\n\n**Task 4: Check in with reviewer**\nDescription: Asking the reviewer to review loading calcs\n\n• Reviewer check discussion - **0.2 days**\n• Rework as a result of checks - **1.0 day**\n\n**Task 5: Structural analysis**\nDescription: Structural analysis models to determine element moment, forces, and stresses\n\n• Determining the software and structural analysis models required for finding the required loads - **1 day**\n• Building the structural analysis models - **5 days**\n• Analysing the results of the models and doing spot checks - **2 days**\n• Further model iterations - **2 days**\n\n**Task 6: Section designs**\nDescription: The design of each of the structural elements of the bridge\n\n• Deck longitudinal design - **5 days**\n• Transverse steel design - **3 days**\n• Abutment wall design - **3 days**\n• Deck overhang checks - **1 day**\n• Pilecap designs - **3 days**\n• Pile designs - **3 days**\n• Approach slab designs - **1 day**\n• Earwall designs - **3 days**\n• Buried joint design - **0.5 days**\n• Superstructure vibration checks - **0.5 days**\n• Fatigue checks - **1 day**\n• Creep and shrinkage checks - **1 day**\n\n**Task 7: Final geometry checks**\nDescription: Final geometry checks after all the sections have been designed\n\n• Precamber checks - **1 day**\n• Vertical deflection checks - **1 day**\n• Vertical and horizontal clearance checks - **0.5 days**\n• Determining deck levels at certain intervals - **1 day**\n\n**Task 8: Miscellaneous items**\nDescription: Additional items for you to consider\n\n• Bridge waterproofing details - **2 days**\n• Bridge number plates - **0.3 days**\n• Drainage details - **2 days**\n• Barrier and endblock design and layout - **2 days**\n\n**Task 9: Sketches for draftspersons and BIM modellers**\nDescription: Creating detailed sketches for communication of the elements that need to be included on the drawings\n\n• Pile details - **0.5 days**\n• Pile cap details - **0.5 days**\n• Abutment details - **1 day**\n• Deck details - **2 days**\n• Barriers and endblock details - **1 day**\n• Miscellaneous bridge items - **3 days**\n\n**Task 10: Detailed review from the reviewer**\nDescription: Detailed design check by the reviewer\n\n• Reviewer design check - **10 days**\n• Discussions with reviewer - **2 days**\n\n**Task 11: Design adjustments after review**\nDescription: Adjustments to various parts of the design after the review\n\n• Adjustments to various parts of the design after the review - **10 days**\n• Final review by the reviewer + final adjustments - **3 days**\n\n**Task 12: Bill of quantities and specs**\nDescription: Various reports to be developed for the design\n\n• Bill of quantities (Bill of schedules) - **2 days**\n• Specification documents - **3 days**\n\n**Task 13: Calculation reports**\nDescription: Detailed design calculation report for summarising all the data from the design for future reference\n\n• Calculation report - **10 days**\n\nPlease confirm you are happy with the plan so that we can start populating the board.",
    delay: 2500,
    needsConfirmation: true,
  },
]

export const INITIAL_MESSAGE = CHAT_SCRIPT[0].content

