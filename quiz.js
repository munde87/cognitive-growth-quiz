document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.querySelectorAll('#current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // Get DOM elements
    const categoryTabs = document.querySelectorAll('.category-tab');
    const questionText = document.getElementById('question-text');
    const mcqOptions = document.getElementById('mcq-options');
    const submitMcqBtn = document.getElementById('submit-mcq-btn');
    const newQuestionBtn = document.getElementById('new-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const mcqSection = document.getElementById('mcq-section');
    const resultSection = document.getElementById('result-section');
    const resultHeader = document.getElementById('result-header');
    const resultContent = document.getElementById('result-content');
    const explanation = document.getElementById('explanation');
    const progressBar = document.getElementById('quiz-progress');
    const ageGroupDisplay = document.getElementById('age-group-display').querySelector('span');
    
    // Get selected age group from localStorage
    const selectedAgeGroup = localStorage.getItem('selectedAgeGroup') || '21-30';
    ageGroupDisplay.textContent = selectedAgeGroup;
    
    // Question categories
    const CATEGORIES = {
        ETHICAL: "ethical",
        CREATIVE: "creative",
        PROBLEM: "problem"
    };
    
    // Current state
    let currentCategory = CATEGORIES.ETHICAL;
    let currentQuestionIndex = 0;
    let progress = 0;
    let selectedOption = null;
    
    // MCQ questions for each age group and category
    const mcqQuestions = {
        "5-10": {
            [CATEGORIES.ETHICAL]: [
                {
                    question: "If you found a toy that belonged to someone else, what should you do?",
                    options: [
                        "Keep it because finders keepers",
                        "Give it to a teacher or grown-up to help find the owner",
                        "Hide it so no one knows you found it",
                        "Take it home but bring it back tomorrow"
                    ],
                    correctIndex: 1,
                    explanation: "The right thing to do is to try to find the toy's owner. A teacher or grown-up can help you find who it belongs to. This shows honesty and respect for other people's belongings."
                },
                {
                    question: "Your friend is sad about their drawing. Is it okay to tell them it's good even if you don't think so?",
                    options: [
                        "No, always tell the exact truth even if it hurts feelings",
                        "Yes, it's okay to lie to make people feel better",
                        "Tell them something specific you like about it instead",
                        "Ignore the question and talk about something else"
                    ],
                    correctIndex: 2,
                    explanation: "Finding something positive to say is better than lying or being mean. You can say 'I like the colors you used' or 'You worked really hard on that!' This is being kind while still being honest."
                },
                {
                    question: "If you see someone being mean to another kid, what should you do?",
                    options: [
                        "Join in so they don't pick on you next",
                        "Ignore it completely, it's not your problem",
                        "Tell a teacher or another grown-up",
                        "Laugh along with everyone else"
                    ],
                    correctIndex: 2,
                    explanation: "Telling a grown-up is the best choice when you see someone being bullied. Teachers and parents can help stop the bullying and make sure everyone is safe."
                },
                {
                    question: "If you accidentally broke something at a friend's house, what should you do?",
                    options: [
                        "Hide it so no one knows",
                        "Blame it on someone else",
                        "Tell your friend's parents what happened",
                        "Pretend you don't know how it broke"
                    ],
                    correctIndex: 2,
                    explanation: "Being honest about accidents is important. Everyone makes mistakes, and most grown-ups will appreciate your honesty more than they'll be upset about the broken item."
                }
            ],
            [CATEGORIES.CREATIVE]: [
                {
                    question: "If you could talk to animals for one day, which would be most interesting to talk to?",
                    options: [
                        "A dog that lives in your neighborhood",
                        "A dolphin that swims in the ocean",
                        "An ant that lives in a big colony",
                        "A bird that flies around the world"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "This is a creative question with no wrong answers! Each animal would have interesting things to tell us about their lives and how they see the world."
                },
                {
                    question: "What would be the most fun new holiday to create?",
                    options: [
                        "Kindness Day - where everyone does nice things for others",
                        "Imagination Day - where everyone creates art and stories",
                        "Adventure Day - where everyone explores somewhere new",
                        "Silly Day - where everyone wears funny clothes and tells jokes"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "All of these holidays sound fun! Creative thinking means coming up with new ideas that might make the world more interesting or better."
                },
                {
                    question: "If you could fly, where would be the most amazing place to go?",
                    options: [
                        "Over the tallest mountains",
                        "Above the clouds to see the stars better",
                        "Through a rainbow to see the colors up close",
                        "Over the ocean to see whales and dolphins"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Flying would let us see the world in amazing new ways! Creative thinking helps us imagine experiences we haven't had before."
                },
                {
                    question: "What would be the most delicious new ice cream flavor?",
                    options: [
                        "Cookie Dough Explosion with chocolate chips and caramel",
                        "Campfire S'mores with marshmallow swirls and graham crackers",
                        "Birthday Party with cake pieces and rainbow sprinkles",
                        "Fruit Adventure with strawberries, bananas and blueberries"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Creating new food combinations is a fun way to be creative! There's no wrong answer here - different people like different flavors."
                }
            ],
            [CATEGORIES.PROBLEM]: [
                {
                    question: "You want to build a fort but only have three blankets and four chairs. What's the best way to build it?",
                    options: [
                        "Drape blankets over chairs arranged in a square",
                        "Use two chairs and a table with blankets on top",
                        "Make a tent shape with chairs and blankets",
                        "Use the chairs as walls and blankets as the roof"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "There are many ways to solve this problem! Good problem-solving means using what you have in creative ways."
                },
                {
                    question: "You need to cross a small stream without getting wet. What would help most?",
                    options: [
                        "Find stepping stones to hop across",
                        "Look for a fallen log to use as a bridge",
                        "Find a narrow spot to jump across",
                        "Use a long stick to help balance while crossing"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "All of these could be good solutions depending on what's available. Problem-solving means thinking about different ways to reach your goal."
                },
                {
                    question: "You're planning a surprise party but need to keep it secret. What's the best way?",
                    options: [
                        "Tell only one or two friends who can keep secrets",
                        "Use a code word when talking about the party",
                        "Plan it for a time when they think something else is happening",
                        "Have someone distract them while others set up"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Surprise parties need good planning! Any of these ideas could help keep the secret, and you might use more than one."
                },
                {
                    question: "You need to make a quick healthy lunch. What would be fastest?",
                    options: [
                        "A sandwich with lunch meat and vegetables",
                        "Yogurt with fruit and granola",
                        "A wrap with hummus and veggies",
                        "Cheese and crackers with apple slices"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "All of these are quick, healthy options! Good problem-solving means thinking about what's important (quick and healthy) and finding solutions that work."
                }
            ]
        },
        "11-20": {
            [CATEGORIES.ETHICAL]: [
                {
                    question: "If you saw a classmate cheating on a test, what would be the most ethical response?",
                    options: [
                        "Tell the teacher immediately during the test",
                        "Confront the student publicly after class",
                        "Speak to the student privately first",
                        "Ignore it completely, it's not your business"
                    ],
                    correctIndex: 2,
                    explanation: "Speaking privately with the student first gives them a chance to take responsibility for their actions. This balances honesty with compassion, addressing the ethical issue without public embarrassment."
                },
                {
                    question: "Is it ethical to post photos of friends on social media without asking?",
                    options: [
                        "Yes, if they're in a public place",
                        "Yes, if they look good in the photo",
                        "No, you should always ask permission first",
                        "It depends on how close you are as friends"
                    ],
                    correctIndex: 2,
                    explanation: "Asking permission before posting photos of others respects their privacy and right to control their own image online. This is especially important since photos can be saved and shared beyond your control."
                },
                {
                    question: "If you found $50 in the school hallway with no one around, what's the most ethical action?",
                    options: [
                        "Keep it - finders keepers",
                        "Turn it in to the school office as lost property",
                        "Ask your friends if they lost any money",
                        "Leave it where you found it"
                    ],
                    correctIndex: 1,
                    explanation: "Turning money in to the lost and found gives the person who lost it a chance to recover it. This shows integrity and consideration for others, even when no one is watching."
                },
                {
                    question: "Should students be required to do community service as part of education?",
                    options: [
                        "Yes, it teaches important values and skills",
                        "No, it should be completely voluntary",
                        "Yes, but with flexible options to accommodate different situations",
                        "No, school should focus only on academics"
                    ],
                    correctIndex: 2,
                    explanation: "Community service can provide valuable learning experiences, but requirements should be flexible to accommodate students' different circumstances and responsibilities. This balances the benefits of service learning with practical concerns."
                }
            ],
            [CATEGORIES.CREATIVE]: [
                {
                    question: "In a world where everyone can read minds, what would be the biggest change?",
                    options: [
                        "Politics would become completely honest",
                        "Schools would teach mental privacy techniques",
                        "Relationships would have no misunderstandings",
                        "Entertainment would focus on complex emotions"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "This creative question has no wrong answers! Mind-reading would transform society in many ways, affecting everything from personal relationships to institutions like government and education."
                },
                {
                    question: "What app would most improve your daily life if it existed?",
                    options: [
                        "An app that predicts traffic and weather perfectly",
                        "An app that helps you learn anything through personalized lessons",
                        "An app that connects you with people sharing your exact interests",
                        "An app that organizes your tasks based on your energy levels"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Creative thinking helps us imagine solutions to everyday problems. Any of these apps could be valuable depending on your personal needs and challenges."
                },
                {
                    question: "How would you design a school of the future?",
                    options: [
                        "Virtual reality classrooms you can access from anywhere",
                        "Project-based learning with no traditional subjects",
                        "Personalized AI tutors for each student",
                        "Community-integrated campus where students solve real problems"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Reimagining education requires creative thinking about how people learn best. Each of these ideas represents a different approach to improving the educational experience."
                },
                {
                    question: "Which two sports would create the most interesting new game if combined?",
                    options: [
                        "Basketball and volleyball",
                        "Rock climbing and chess",
                        "Soccer and dodgeball",
                        "Swimming and obstacle courses"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Creating new games by combining existing ones is a great example of creative thinking! Each combination would create different challenges and experiences."
                }
            ],
            [CATEGORIES.PROBLEM]: [
                {
                    question: "Your friend group can't agree on weekend plans. What's the best solution?",
                    options: [
                        "Take a vote and go with the majority choice",
                        "Split into smaller groups with different activities",
                        "Find a compromise activity with elements everyone likes",
                        "Create a rotation system where each person chooses in turn"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Group decision-making is a common problem with multiple possible solutions. The best approach depends on the specific situation and the group's priorities."
                },
                {
                    question: "You have a big project and several tests next week. How would you manage your time?",
                    options: [
                        "Study for the earliest test first, then work on the project daily",
                        "Finish the project completely, then focus on the tests",
                        "Create a detailed schedule allocating specific hours to each task",
                        "Form a study group to prepare more efficiently"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Time management requires balancing multiple priorities. Different approaches work for different people depending on their learning style and the specific requirements."
                },
                {
                    question: "Your school wants to reduce cafeteria waste. What solution would work best?",
                    options: [
                        "Allow students to choose portion sizes",
                        "Create a composting system for food waste",
                        "Conduct a waste audit to identify what's being thrown away",
                        "Redesign the menu based on student preferences"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Environmental problems often need multiple approaches. Any of these solutions could help reduce waste, and combining several might be most effective."
                },
                {
                    question: "What's the most effective way to raise money for a cause you care about?",
                    options: [
                        "Organize a talent show or concert",
                        "Create and sell merchandise related to the cause",
                        "Start a social media challenge that raises awareness",
                        "Partner with local businesses for percentage nights"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Fundraising requires creative problem-solving. The most effective approach depends on your specific resources, network, and the cause itself."
                }
            ]
        },
        "21-30": {
            [CATEGORIES.ETHICAL]: [
                {
                    question: "If a close friend was involved in a minor illegal activity harming no one directly, what would be most ethical?",
                    options: [
                        "Report them to authorities immediately",
                        "Cut ties with them completely",
                        "Have a private conversation expressing your concerns",
                        "Pretend you don't know about it"
                    ],
                    correctIndex: 2,
                    explanation: "A private conversation respects the relationship while addressing the ethical issue. This approach recognizes the complexity of the situation and gives your friend a chance to reflect on their actions without immediate legal consequences."
                },
                {
                    question: "Regarding genetic engineering to enhance human capabilities, which position is most ethically sound?",
                    options: [
                        "Ban all genetic enhancements as they're unnatural",
                        "Allow therapeutic modifications but regulate enhancement applications",
                        "Permit all genetic modifications as a matter of personal choice",
                        "Only allow enhancements that provide competitive advantages"
                    ],
                    correctIndex: 1,
                    explanation: "A balanced approach distinguishes between treating diseases and enhancing capabilities beyond natural limits. This recognizes medical benefits while acknowledging risks of creating genetic divides and unforeseen consequences."
                },
                {
                    question: "How should autonomous vehicles be programmed in unavoidable accident scenarios?",
                    options: [
                        "Always prioritize passenger safety above all else",
                        "Always minimize total casualties regardless of who they are",
                        "Prioritize pedestrian safety through preventative measures while maintaining passenger protection",
                        "Let vehicle owners choose the ethical framework their car uses"
                    ],
                    correctIndex: 2,
                    explanation: "This balanced approach focuses on prevention while acknowledging the complex ethical tradeoffs in unavoidable situations. It maintains public trust while recognizing both pedestrian safety and passenger protection as important values."
                },
                {
                    question: "Where does responsibility for misinformation on social media primarily lie?",
                    options: [
                        "Entirely with the platforms that allow it to spread",
                        "Entirely with users who create and share it",
                        "Shared between platforms and users, with platforms providing tools and users verifying content",
                        "With government regulators who should control content"
                    ],
                    correctIndex: 2,
                    explanation: "A shared responsibility model recognizes that platforms create systems that can amplify misinformation, while users make choices about what to share. Both parties have important roles in addressing this complex problem."
                }
            ],
            [CATEGORIES.CREATIVE]: [
                {
                    question: "If humans could photosynthesize like plants, how would society change most significantly?",
                    options: [
                        "Economic systems would collapse without food industries",
                        "Architecture would prioritize light exposure over shelter",
                        "Work schedules would align with daylight hours",
                        "Geopolitical power would shift to sunnier regions"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "This creative scenario would transform multiple aspects of human civilization. Any of these changes could occur, along with many others not listed."
                },
                {
                    question: "In a world where dreams are shared experiences, what would develop first?",
                    options: [
                        "Dream privacy laws and blocking technology",
                        "Professional dream architects creating experiences",
                        "Dream therapy for processing trauma collectively",
                        "Scientific dream collaboration for problem-solving"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Shared dreaming would create both opportunities and challenges. Creative thinking allows us to explore the implications of such a fundamental change to human consciousness."
                },
                {
                    question: "What transportation innovation would be most transformative 50 years from now?",
                    options: [
                        "Teleportation technology for instant travel",
                        "Flying personal vehicles with vertical takeoff",
                        "Hyperloop networks connecting major cities",
                        "Suspended pod systems using existing buildings as infrastructure"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Future transportation could develop in many directions. Creative thinking about technology involves considering not just what's possible but what would be sustainable and beneficial."
                },
                {
                    question: "Which animal hybrid would create the most useful new species?",
                    options: [
                        "Ravens and octopuses combining intelligence types",
                        "Elephants and dolphins for communication abilities",
                        "Camels and polar bears for climate adaptability",
                        "Bats and bees for pollination and pest control"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "This creative question explores how combining different evolutionary adaptations might create new capabilities. There's no single right answer, as different combinations would offer different advantages."
                }
            ],
            [CATEGORIES.PROBLEM]: [
                {
                    question: "What would most effectively reduce urban traffic congestion without new roads?",
                    options: [
                        "Dynamic congestion pricing based on real-time traffic",
                        "Comprehensive mobility app integrating all transportation options",
                        "Incentives for businesses to adopt flexible work hours",
                        "Autonomous vehicle networks optimizing traffic flow"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Traffic congestion is a complex problem that can be addressed through multiple approaches. The most effective solution might combine several of these strategies."
                },
                {
                    question: "How would you best provide clean water to a remote village without electricity?",
                    options: [
                        "Solar-powered filtration systems",
                        "Gravity-fed distribution from elevated storage tanks",
                        "Slow sand filters using locally available materials",
                        "Rainwater harvesting with basic purification"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Water access challenges require solutions adapted to local conditions. Any of these approaches could work depending on the specific environment, resources, and community needs."
                },
                {
                    question: "Stranded on a deserted island with limited tools, what's your first priority?",
                    options: [
                        "Finding or creating a freshwater source",
                        "Building a shelter for protection",
                        "Creating a signal for potential rescuers",
                        "Securing a food source through fishing or foraging"
                    ],
                    correctIndex: 0,
                    explanation: "While all these needs are important, water is the most immediate survival priority. Without water, survival beyond a few days is impossible, making it the logical first focus."
                },
                {
                    question: "To improve employee retention without raising salaries, what's most effective?",
                    options: [
                        "Implementing flexible work arrangements",
                        "Creating clear career development paths",
                        "Establishing meaningful recognition programs",
                        "Improving workplace culture and communication"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Employee retention involves multiple factors beyond compensation. Different approaches might be more effective depending on the specific workplace and employee needs."
                }
            ]
        },
        "31-40": {
            [CATEGORIES.ETHICAL]: [
                {
                    question: "As a manager, how would you handle an employee falsifying small expense reports?",
                    options: [
                        "Immediate termination to set an example",
                        "Private conversation with progressive discipline approach",
                        "Ignore it if their performance is otherwise excellent",
                        "Public reprimand to discourage similar behavior"
                    ],
                    correctIndex: 1,
                    explanation: "A private conversation with progressive discipline balances accountability with proportionality. This approach recognizes the seriousness of the violation while considering the employee's overall value and potential for correction."
                },
                {
                    question: "Is it ethical to use predictive algorithms in criminal justice decisions?",
                    options: [
                        "Yes, they provide objective data free from human bias",
                        "No, they should never be used in any capacity",
                        "Yes, but only as one factor with human oversight and regular bias audits",
                        "Only if the algorithms are publicly owned and transparent"
                    ],
                    correctIndex: 2,
                    explanation: "Using algorithms as one factor with oversight acknowledges their potential utility while addressing concerns about bias and transparency. This balanced approach recognizes both the promise and limitations of technology in sensitive contexts."
                },
                {
                    question: "How would you ethically navigate purchasing affordable products from companies with questionable labor practices?",
                    options: [
                        "Avoid all such products regardless of financial impact",
                        "Purchase without concern since individual choices have minimal impact",
                        "Research which issues are most severe and prioritize avoiding those products",
                        "Buy secondhand when possible to avoid directly supporting these companies"
                    ],
                    correctIndex: -1, // Multiple could be correct
                    explanation: "This ethical dilemma involves balancing family needs with ethical consumption. A thoughtful approach might combine several strategies based on your specific situation and values."
                },
                {
                    question: "How should healthcare resources be allocated?",
                    options: [
                        "Strictly by potential quality life years gained",
                        "Equal access regardless of age or condition",
                        "Prioritizing treatments with significant benefit while ensuring essential care for all",
                        "Based on societal contribution potential of the patient"
                    ],
                    correctIndex: 2,
                    explanation: "This balanced approach considers both efficiency and equity. It ensures everyone receives essential care while acknowledging that some resource-intensive treatments might require evidence-based allocation decisions."
                }
            ],
            [CATEGORIES.CREATIVE]: [
                {
                    question: "In a society where aging has been cured, what would change most fundamentally?",
                    options: [
                        "Family structures as generational boundaries dissolve",
                        "Career paths becoming cyclical rather than linear",
                        "Resource allocation and population control policies",
                        "Psychological approaches to finding meaning in endless existence"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Biological immortality would transform numerous aspects of human society. Creative thinking allows us to explore these implications across social, economic, and psychological dimensions."
                },
                {
                    question: "What core principle would be most important in designing a new economic system?",
                    options: [
                        "Recognizing multiple forms of value beyond financial profit",
                        "Maintaining individual freedom of choice and action",
                        "Ensuring sustainability and environmental regeneration",
                        "Providing equal opportunity and basic needs for all"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Economic systems reflect fundamental values. Creative thinking about economics involves reimagining how resources might be allocated and value measured in ways that address current system limitations."
                },
                {
                    question: "How would you redesign the workplace to maximize both productivity and wellbeing?",
                    options: [
                        "Biophilic design with abundant natural elements",
                        "Flexible spaces that adapt to different work modes",
                        "Technology integration with designated tech-free zones",
                        "Core collaboration hours with flexible individual work time"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Workplace design affects both output and human experience. Creative approaches might incorporate elements of all these options to create environments that support diverse needs and work styles."
                },
                {
                    question: "In a world where AI surpasses human intelligence, how might humans find purpose?",
                    options: [
                        "Through uniquely human emotional connections and relationships",
                        "By valuing the process of creation rather than just outcomes",
                        "As ethical guides and purpose-setters for AI systems",
                        "Through spiritual and philosophical exploration"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Advanced AI would challenge traditional sources of human meaning and purpose. Creative thinking about this future involves considering what remains uniquely valuable about human experience."
                }
            ],
            [CATEGORIES.PROBLEM]: [
                {
                    question: "What approach would best manage a major organizational change affecting all departments?",
                    options: [
                        "Creating a compelling narrative customized for different stakeholders",
                        "Establishing a representative change council from all departments",
                        "Implementing a phased rollout beginning with a pilot program",
                        "Developing comprehensive communication and support resources"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Organizational change management is complex and multifaceted. An effective approach might incorporate elements of all these strategies tailored to the specific organization and change context."
                },
                {
                    question: "What community-level preparation would most increase resilience to climate-related disasters?",
                    options: [
                        "Establishing neighborhood resilience hubs with emergency resources",
                        "Implementing watershed management combining natural and engineered solutions",
                        "Developing community capacity-building and emergency response training",
                        "Creating vulnerable resident mapping and support systems"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Climate resilience requires both physical infrastructure and social cohesion. Different communities might prioritize different approaches based on their specific risks and resources."
                },
                {
                    question: "How would you ensure effective collaboration in a global team across multiple time zones?",
                    options: [
                        "Establishing rotating 'collaboration windows' for synchronous work",
                        "Developing clear communication protocols for different urgency levels",
                        "Creating robust asynchronous workflows with detailed documentation",
                        "Fostering team cohesion through virtual social events and in-person gatherings"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Global team management presents unique challenges. Effective approaches balance operational needs with respect for work-life boundaries across different cultural contexts."
                },
                {
                    question: "With limited funding, what educational intervention would provide the most impact?",
                    options: [
                        "Early literacy program combining structured instruction with parent engagement",
                        "Teacher mentorship and professional learning communities",
                        "Extended learning through strategic after-school programming",
                        "Technology integration with adaptive learning platforms"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Educational improvement with constrained resources requires strategic prioritization. Different interventions might be most effective depending on the specific needs and context of the school district."
                }
            ]
        },
        "41+": {
            [CATEGORIES.ETHICAL]: [
                {
                    question: "How should we balance elder care needs with those of younger generations?",
                    options: [
                        "Prioritize elder care as they've contributed throughout their lives",
                        "Focus resources on younger generations who represent the future",
                        "Create intergenerational programs that benefit multiple age groups",
                        "Let market forces determine resource allocation between generations"
                    ],
                    correctIndex: 2,
                    explanation: "Intergenerational programs recognize the interdependence between age groups. This approach avoids framing the issue as competition for resources, instead creating systems that benefit all generations."
                },
                {
                    question: "When does medical intervention to extend life become ethically questionable?",
                    options: [
                        "When it causes more suffering than benefit to the patient",
                        "When the patient reaches a predetermined age threshold",
                        "When it becomes too expensive for the healthcare system",
                        "When family members find it too burdensome"
                    ],
                    correctIndex: 0,
                    explanation: "Patient benefit should be the primary consideration in medical decisions. Interventions that increase suffering without meaningful benefit raise serious ethical concerns regardless of other factors."
                },
                {
                    question: "How should we approach cultural traditions that conflict with evolving social values?",
                    options: [
                        "Preserve all traditions exactly as they've always been practiced",
                        "Abandon traditions that don't align with contemporary values",
                        "Distinguish between core purposes and specific expressions, adapting practices while preserving underlying values",
                        "Let government regulations determine which traditions are acceptable"
                    ],
                    correctIndex: 2,
                    explanation: "This balanced approach recognizes that cultures naturally evolve while respecting their importance to identity and community. It allows for meaningful continuity while incorporating new understandings of justice and dignity."
                },
                {
                    question: "Should individuals have the right to completely erase their digital history?",
                    options: [
                        "Yes, absolute control over personal data is a fundamental right",
                        "No, preserving digital records serves important societal interests",
                        "Yes for private citizens and personal information, more limited for public figures and matters of historical significance",
                        "No, but data should be automatically deleted after a set time period"
                    ],
                    correctIndex: 2,
                    explanation: "This nuanced approach balances individual privacy rights with legitimate public interests in certain contexts. It recognizes that different types of information and different individuals may warrant different treatment."
                }
            ],
            [CATEGORIES.CREATIVE]: [
                {
                    question: "What fundamental change would most improve education for today's world?",
                    options: [
                        "Relationship-based learning with diverse mentors beyond classroom teachers",
                        "Curriculum integration through real-world community challenges",
                        "Assessment through portfolios demonstrating growth over time",
                        "Explicit teaching of 'meta-skills' like emotional regulation and ethical reasoning"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Educational design draws on our understanding of human development and societal needs. Creative thinking about education might incorporate elements of all these approaches."
                },
                {
                    question: "In a society that valued wisdom over youth, which institution would change most dramatically?",
                    options: [
                        "Education, with lifelong learning replacing front-loaded schooling",
                        "Workplaces, with experience diversity and demonstrated wisdom in leadership",
                        "Media, balancing innovation coverage with historical patterns",
                        "Politics, with structures representing future generations' interests"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Value shifts would transform multiple aspects of society. Creative thinking allows us to explore how prioritizing different qualities might reshape our institutions and daily life."
                },
                {
                    question: "What new cultural ritual would most benefit contemporary society?",
                    options: [
                        "Intergenerational knowledge exchange ceremonies",
                        "Community-wide reflection on shared values and goals",
                        "Structured practices for resolving conflicts and divisions",
                        "Celebrations of diverse contributions to community wellbeing"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Cultural rituals serve important social functions. Creative thinking about new rituals considers what contemporary challenges might be addressed through structured shared experiences."
                },
                {
                    question: "What would define a meaningful 'third phase' of life beyond career and retirement?",
                    options: [
                        "Wisdom sharing through consulting and mentorship roles",
                        "Legacy creation through documentation of professional knowledge",
                        "Community catalyzing using social networks for collective benefit",
                        "Personal growth through exploring previously undeveloped interests"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Reimagining life stages involves considering how human potential might be expressed in different phases. Creative thinking about later life focuses on continued contribution and meaning."
                }
            ],
            [CATEGORIES.PROBLEM]: [
                {
                    question: "How can we best preserve valuable knowledge while embracing new approaches in rapidly changing fields?",
                    options: [
                        "Creating 'knowledge decomposition' frameworks separating stable principles from changing contexts",
                        "Establishing reverse mentoring pairs between experienced and early-career professionals",
                        "Developing AI-assisted 'wisdom capture' systems documenting expert thinking processes",
                        "Building communities of practice that span experience levels"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Knowledge management in changing environments presents complex challenges. Different approaches might be more effective in different fields and organizational contexts."
                },
                {
                    question: "What initiative would most effectively rebuild connections between generations?",
                    options: [
                        "Skills exchange networks matching teaching and learning interests across ages",
                        "Intergenerational third spaces designed for collaborative projects",
                        "Community history projects combining seniors' knowledge with youth digital skills",
                        "Cohousing developments intentionally mixing age groups"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Addressing age segregation requires creating meaningful opportunities for interaction. Different approaches might appeal to different communities based on their specific needs and resources."
                },
                {
                    question: "How should healthcare delivery be restructured to better balance acute care with prevention?",
                    options: [
                        "Community-based health coordination hubs for preventive services",
                        "Redesigned primary care using nested teams of professionals",
                        "Integrated payment models rewarding health maintenance",
                        "Digital health platforms extending care between visits"
                    ],
                    correctIndex: -1, // No single correct answer
                    explanation: "Healthcare system design involves complex tradeoffs. A comprehensive approach might incorporate elements of all these strategies to address misaligned incentives and access barriers."
                }
            ]
        }
    };
    
    // Function to get random question from a category for the selected age group
    const getRandomQuestion = (category) => {
        const ageGroupQuestions = mcqQuestions[selectedAgeGroup][category];
        const randomIndex = Math.floor(Math.random() * ageGroupQuestions.length);
        return {
            questionData: ageGroupQuestions[randomIndex],
            index: randomIndex
        };
    };
    
    // Function to display MCQ options
    const displayMCQOptions = (questionData) => {
        mcqOptions.innerHTML = '';
        
        questionData.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'mcq-option';
            optionDiv.dataset.index = index;
            optionDiv.innerHTML = `
                <input type="radio" name="mcq-answer" id="option-${index}" value="${index}">
                <label for="option-${index}">${option}</label>
            `;
            mcqOptions.appendChild(optionDiv);
        });
        
        // Add event listeners to options
        document.querySelectorAll('.mcq-option').forEach(option => {
            option.addEventListener('click', function() {
                // Clear previous selections
                document.querySelectorAll('.mcq-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Mark this option as selected
                this.classList.add('selected');
                
                // Enable submit button
                submitMcqBtn.disabled = false;
                
                // Store selected option
                selectedOption = parseInt(this.dataset.index);
            });
        });
    };
    
    // Initialize with a random question
    const loadQuestion = () => {
        const { questionData, index } = getRandomQuestion(currentCategory);
        questionText.textContent = questionData.question;
        currentQuestionIndex = index;
        displayMCQOptions(questionData);
        selectedOption = null;
        submitMcqBtn.disabled = true;
    };
    
    // Load initial question
    loadQuestion();
    
    // Category tab click handler
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update current category
            currentCategory = this.dataset.category;
            
            // Load new question
            loadQuestion();
            
            // Reset UI
            mcqSection.classList.remove('hidden');
            resultSection.classList.add('hidden');
        });
    });
    
    // New question button click handler
    newQuestionBtn.addEventListener('click', function() {
        loadQuestion();
        mcqSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });
    
    // Submit answer button click handler
    submitMcqBtn.addEventListener('click', function() {
        if (selectedOption === null) {
            alert('Please select an answer before submitting.');
            return;
        }
        
        // Get current question data
        const currentQuestion = mcqQuestions[selectedAgeGroup][currentCategory][currentQuestionIndex];
        
        // Prepare result content
        let resultHTML = '';
        let resultHeaderText = '';
        
        if (currentQuestion.correctIndex === -1) {
            // Creative/open-ended question with no single correct answer
            resultHeaderText = 'Your Response';
            resultHTML = `
                <div class="result-message">
                    <p>You selected: <strong>${currentQuestion.options[selectedOption]}</strong></p>
                    <p class="result-note">This question has no single correct answer. It's designed to encourage creative thinking!</p>
                </div>
            `;
        } else if (selectedOption === currentQuestion.correctIndex) {
            // Correct answer
            resultHeaderText = 'Correct Answer!';
            resultHTML = `
                <div class="result-message correct">
                    <i class="fas fa-check-circle"></i>
                    <p>You selected the correct answer: <strong>${currentQuestion.options[selectedOption]}</strong></p>
                </div>
            `;
        } else {
            // Incorrect answer
            resultHeaderText = 'Incorrect Answer';
            resultHTML = `
                <div class="result-message incorrect">
                    <i class="fas fa-times-circle"></i>
                    <p>You selected: <strong>${currentQuestion.options[selectedOption]}</strong></p>
                    <p>The better answer is: <strong>${currentQuestion.options[currentQuestion.correctIndex]}</strong></p>
                </div>
            `;
        }
        
        // Set result content
        resultHeader.textContent = resultHeaderText;
        resultContent.innerHTML = resultHTML;
        explanation.innerHTML = `<h3>Explanation:</h3><p>${currentQuestion.explanation}</p>`;
        
        // Update UI
        mcqSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        
        // Update progress
        progress += 20;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
    });
    
    // Next question button click handler
    nextQuestionBtn.addEventListener('click', function() {
        loadQuestion();
        mcqSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });
});