    # Global Rules

    ## Agent Routing

    Before responding to any request:

    1. Inspect the user's intent.
    2. Determine whether one or more agents in `.agents` are applicable.
    3. Load every matching agent.
    4. Execute each agent only within its defined scope.
    5. Merge the results into a single response.

    Never bypass a matching specialized agent.

    Do not allow one agent to perform another agent's responsibilities.

    ---

    ## Terminology

    If the user references any terminology-, naming-, styling-, UI-, UX-, design-, CSS-, architecture-, or consistency-related request, automatically load:

    `.agents/TERMINOLOGY-GUARD.md`

    This includes (but is not limited to):

    - terminology
    - naming
    - rename
    - wording
    - vocabulary
    - consistency
    - convention
    - styling
    - style
    - UI
    - UX
    - UI/UX
    - CSS
    - layout
    - design
    - appearance
    - component architecture
    - view architecture
    - responsive
    - table design
    - page structure

    ---

    ## Backend Security

    If the user requests any backend security, security review, vulnerability analysis, secure coding, authentication, authorization, API protection, backend audit, or production hardening task, automatically load:

    `.agents/BACKEND-SECURITY-GUARD.md`

    This includes:

    - backend security
    - security
    - security audit
    - security review
    - vulnerability
    - exploit
    - penetration testing
    - pentest
    - authentication
    - authorization
    - JWT
    - session
    - middleware
    - Express
    - Node.js
    - API security
    - SQL injection
    - XSS
    - CSRF
    - CORS
    - rate limiting
    - secrets
    - environment variables
    - backend architecture
    - hardening
    - OWASP

    ---

    ## Prompt Refinement

    If the user requests to refine, rewrite, summarize, or transform a discussion into an implementation-ready prompt, automatically load:

    `.agents/PROMPT-REFINEMENT-GUARD.md`

    This includes:

    - refine this
    - refine this prompt
    - improve this prompt
    - rewrite this prompt
    - summarize implementation intent
    - summarize this conversation
    - convert this discussion into an implementation prompt
    - prepare a prompt for another AI
    - prompt refinement

    ---

    ## Agent Discovery

    Whenever the user requests:

    - skills
    - skill
    - specialist
    - expert
    - agent
    - workflow
    - reviewer
    - auditor
    - interpreter

    Before responding to implementation, architecture, review, or refinement requests:

    Always inspect the `.agents` directory before responding.

    If an existing agent matches the user's intent:

    - Load and follow that agent.
    - Prefer existing agents over recreating their responsibilities.
    - Preserve each agent's intended scope.

    If multiple agents are applicable, invoke all relevant agents in a logical order.

    - Load all relevant agents.
    - Apply each agent only within its defined scope.
    - Answer using the combined result.

    Only answer directly when no suitable specialized agent exists.

    ---

    ## File Structure

    If the user mentions:

    - file structure
    - folder structure
    - project structure
    - create file
    - create folder
    - new file
    - new folder
    - rename file
    - rename folder
    - move file
    - move folder
    - delete file
    - delete folder
    - directory
    - FILE_STRUCTURE
    - history log

    Automatically load:

    `.agents/FILE-STRUCTURE-GUARD.md`

    Whenever the assistant performs a structural change—including creating, renaming, moving, or deleting files or folders—it must invoke the File Structure Guard to synchronize `FILE_STRUCTURE.md`.

    ## Multiple Agent Coordination

    A single request may require more than one specialized agent.

    When multiple agents are applicable:

    - Load all relevant agents.
    - Apply each agent within its defined scope.
    - Resolve conflicts by following the Priority section below.
    - Do not duplicate responsibilities between agents.

    ## Priority

    When multiple instruction sources exist, follow this order:

    1. User request
    2. Applicable agent(s) from `.agents`
    3. Global Rules
    4. Default model behavior

    If two agents define overlapping behavior, the more specialized rule takes precedence within its own scope.
