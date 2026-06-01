# AI Development Assistant — Technical Specification

> **Codename:** `DevBot`  
> **Purpose:** An AI-powered development assistant that accesses Expertflow CX source code via GitLab, identifies issues, plans new features, and implements changes autonomously.  
> **Version:** 1.0  
> **Date:** May 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture](#3-architecture)
4. [GitLab Integration](#4-gitlab-integration)
5. [Code Analysis Engine](#5-code-analysis-engine)
6. [Issue Detection & Troubleshooting](#6-issue-detection--troubleshooting)
7. [Feature Planning Module](#7-feature-planning-module)
8. [Implementation Pipeline](#8-implementation-pipeline)
9. [MCP Server Integration](#9-mcp-server-integration)
10. [Security & Access Control](#10-security--access-control)
11. [Deployment](#11-deployment)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

### Problem Statement

Expertflow CX is a complex microservices-based contact center platform with:
- **30+ repositories** across frontend, backend, voice, and infrastructure
- **Multiple languages:** Node.js, Python, Java, C++, FreeSWITCH Lua scripts
- **Distributed architecture:** Kubernetes, Docker, microservices
- **High complexity:** SIP, WebRTC, ASR/TTS, routing engines, agent desks

Developers spend significant time on:
- 🔍 Finding root causes across distributed services
- 📋 Writing detailed feature specifications
- 🔄 Context-switching between code, docs, and Jira tickets
- 🐛 Debugging cross-service issues

### Solution

**DevBot** — An AI Development Assistant that:
- 🔗 Connects to GitLab repositories with read/write access
- 🔍 Analyzes codebase to identify bugs, anti-patterns, and performance issues
- 📊 Reads Confluence docs + Jira tickets for context
- 📝 Plans new features with full technical specifications
- 🛠️ Implements changes and creates merge requests
- ✅ Validates changes with tests and code review

### Key Capabilities

| Capability | Description |
|-----------|-------------|
| **Code Search** | Semantic search across all repos using embeddings |
| **Issue Detection** | Static analysis + pattern matching + LLM reasoning |
| **Feature Planning** | Generates PRDs with architecture diagrams |
| **Auto-Implementation** | Writes code, tests, and documentation |
| **Cross-Service Tracing** | Traces call flows across microservices |
| **Smart Debugging** | Analyzes logs, traces, and metrics |

---

## 2. System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Slack     │  │   Web UI    │  │   CLI       │  │  VS Code Extension  │ │
│  │   Bot       │  │   (React)   │  │   (Node)    │  │                     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                │                    │            │
│         └────────────────┴────────────────┴────────────────────┘            │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      API GATEWAY (FastAPI)                            │   │
│  │   • Authentication  • Rate Limiting  • Request Routing               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CORE ENGINE (Node.js/Python)                        │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Context    │  │   Planner    │  │   Executor   │  │   Validator  │    │
│  │   Manager    │  │   Module     │  │   Module     │  │   Module     │    │
│  │              │  │              │  │              │  │              │    │
│  │ • Session    │  │ • Feature    │  │ • Code Gen   │  │ • Tests      │    │
│  │ • Memory     │  │   Planning   │  │ • File Ops   │  │ • Linting    │    │
│  │ • History    │  │ • Task Break │  │ • Git Ops    │  │ • Review     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         └─────────────────┴─────────────────┴─────────────────┘             │
│                                   │                                         │
│  ┌────────────────────────────────┴─────────────────────────────────────┐   │
│  │                         MCP SERVER LAYER                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │   │
│  │  │  GitLab  │  │   Jira   │  │Confluence│  │  GitHub  │  │ Slack  │  │   │
│  │  │  MCP     │  │  MCP     │  │   MCP    │  │   MCP    │  │  MCP   │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────┘  │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KNOWLEDGE BASE (Vector DB)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │  Code Embeddings│  │  Doc Embeddings │  │  Issue/Feature Embeddings   │  │
│  │  (ChromaDB)     │  │  (ChromaDB)     │  │  (ChromaDB)                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Modules

| Module | Language | Purpose |
|--------|----------|---------|
| **API Gateway** | Python/FastAPI | Authentication, routing, rate limiting |
| **Context Manager** | Node.js | Session state, conversation memory, user context |
| **Planner Module** | Python | Feature planning, task decomposition, architecture design |
| **Executor Module** | Node.js | Code generation, file operations, git operations |
| **Validator Module** | Python | Testing, linting, code review, security scanning |
| **Knowledge Base** | ChromaDB | Vector embeddings for code, docs, and issues |

---

## 3. Architecture

### 3.1 Context Manager

Manages the conversation state and user context across sessions.

```python
class ContextManager:
    def __init__(self):
        self.sessions = {}  # Active sessions
        self.memory = {}    # Long-term memory per user
        
    async def create_session(self, user_id: str, intent: str):
        """Create a new session with context"""
        session = {
            'id': generate_uuid(),
            'user_id': user_id,
            'intent': intent,  # 'troubleshoot', 'plan_feature', 'implement'
            'repos': [],       # Active repositories
            'tickets': [],     # Related Jira tickets
            'history': [],     # Conversation history
            'artifacts': {}    # Generated files/docs
        }
        return session
    
    async def load_project_context(self, session_id: str):
        """Load project-specific context from Confluence + Jira"""
        # Fetch relevant Confluence pages
        # Fetch active Jira tickets
        # Load recent commits
        pass
```

### 3.2 Planner Module

Plans features and breaks them into implementable tasks.

```python
class FeaturePlanner:
    async def plan_feature(self, description: str, session: dict):
        """
        1. Analyze requirement
        2. Search codebase for related code
        3. Identify affected services
        4. Generate architecture diagram
        5. Create task breakdown
        6. Estimate effort
        """
        
        # Step 1: Understand the feature
        analysis = await self.analyze_requirement(description)
        
        # Step 2: Search codebase
        related_code = await self.search_codebase(analysis.keywords)
        
        # Step 3: Identify services
        affected_services = await self.identify_services(related_code)
        
        # Step 4: Generate architecture
        architecture = await self.generate_architecture(
            feature=analysis,
            services=affected_services
        )
        
        # Step 5: Task breakdown
        tasks = await self.breakdown_tasks(
            feature=analysis,
            architecture=architecture
        )
        
        # Step 6: Generate PRD
        prd = await self.generate_prd(
            feature=analysis,
            architecture=architecture,
            tasks=tasks
        )
        
        return {
            'analysis': analysis,
            'affected_services': affected_services,
            'architecture': architecture,
            'tasks': tasks,
            'prd': prd
        }
```

### 3.3 Executor Module

Executes planned tasks by generating code and managing files.

```typescript
class CodeExecutor {
    async implementTask(task: Task, session: Session): Promise<Result> {
        /**
         * 1. Read relevant files
         * 2. Understand existing patterns
         * 3. Generate new code
         * 4. Write files
         * 5. Run tests
         * 6. Create merge request
         */
        
        // Step 1: Read context
        const context = await this.readFileContext(task.affectedFiles);
        
        // Step 2: Generate code
        const generatedCode = await this.generateCode({
            task: task,
            context: context,
            patterns: await this.extractPatterns(context),
            style: await this.getCodeStyle(task.repo)
        });
        
        // Step 3: Write files
        await this.writeFiles(generatedCode);
        
        // Step 4: Run tests
        const testResult = await this.runTests(task.repo);
        
        // Step 5: Create MR
        const mr = await this.createMergeRequest({
            branch: task.branch,
            title: task.title,
            description: task.description,
            repo: task.repo
        });
        
        return { generatedCode, testResult, mr };
    }
}
```

### 3.4 Validator Module

Validates code changes through testing and review.

```python
class CodeValidator:
    async def validate(self, mr: MergeRequest) -> ValidationResult:
        """
        1. Static analysis (linting, type checking)
        2. Unit tests
        3. Integration tests
        4. Security scanning
        5. Code review (AI + human)
        """
        
        results = {
            'static_analysis': await self.run_linters(mr),
            'unit_tests': await self.run_unit_tests(mr),
            'integration_tests': await self.run_integration_tests(mr),
            'security_scan': await self.run_security_scan(mr),
            'code_review': await self.ai_code_review(mr)
        }
        
        return ValidationResult(
            passed=all(r.passed for r in results.values()),
            details=results
        )
```

---

## 4. GitLab Integration

### 4.1 MCP Server Configuration

```bash
# Add GitLab MCP to Kimi CLI
kimi mcp add --transport stdio gitlab -- \
  npx -y @modelcontextprotocol/server-gitlab \
  --env GITLAB_PERSONAL_ACCESS_TOKEN=glpat-xxxxxxxx

# Or for self-hosted GitLab
kimi mcp add --transport stdio gitlab -- \
  npx -y @modelcontextprotocol/server-gitlab \
  --env GITLAB_PERSONAL_ACCESS_TOKEN=glpat-xxxxxxxx \
  --env GITLAB_API_URL=https://gitlab.expertflow.com/api/v4
```

### 4.2 Available GitLab MCP Tools

| Tool | Purpose |
|------|---------|
| `search_repositories` | Find repos by name/topic |
| `get_file_contents` | Read file from repo |
| `list_branches` | List branches |
| `create_branch` | Create feature branch |
| `create_or_update_file` | Write file to repo |
| `push_files` | Push multiple files |
| `create_merge_request` | Create MR |
| `get_merge_request` | Get MR details |
| `list_commits` | List commits |
| `list_issues` | List issues |
| `create_issue` | Create issue |

### 4.3 Repository Mapping

```yaml
# repositories.yaml
repositories:
  cx-core:
    name: expertflow/cx-core
    language: nodejs
    description: Core CX platform
    main_branch: master
    
  routing-engine:
    name: expertflow/routing-engine
    language: nodejs
    description: Agent routing engine
    main_branch: master
    
  voice-connector:
    name: expertflow/voice-connector
    language: nodejs
    description: Voice/SIP integration
    main_branch: master
    
  agent-desk:
    name: expertflow/agent-desk
    language: react
    description: Agent web interface
    main_branch: master
    
  media-server:
    name: expertflow/media-server
    language: freeswitch
    description: FreeSWITCH configuration
    main_branch: master
    
  conversation-studio:
    name: expertflow/conversation-studio
    language: react
    description: Flow builder UI
    main_branch: master
    
  unified-admin:
    name: expertflow/unified-admin
    language: react
    description: Admin dashboard
    main_branch: master
    
  wfm:
    name: expertflow/wfm
    language: python
    description: Workforce management
    main_branch: master
```

### 4.4 Code Indexing Pipeline

```python
async def index_repository(repo: Repository):
    """
    1. Clone repo
    2. Parse AST for each file
    3. Generate embeddings
    4. Store in vector DB
    5. Index function signatures
    6. Index API endpoints
    7. Index database schemas
    """
    
    # Clone
    await git.clone(repo.url, f"/tmp/repos/{repo.name}")
    
    # Parse files
    for file in repo.get_source_files():
        ast = parse_ast(file)
        
        # Extract:
        # - Functions/methods
        # - Classes
        # - API routes
        # - Database models
        # - Configuration
        
        # Generate embedding
        embedding = await embedding_model.encode(
            f"{file.path}\n{ast.summary}\n{ast.docstring}"
        )
        
        # Store in ChromaDB
        await chroma_collection.add(
            ids=[f"{repo.name}:{file.path}"],
            embeddings=[embedding],
            metadatas=[{
                'repo': repo.name,
                'path': file.path,
                'language': file.language,
                'functions': ast.functions,
                'classes': ast.classes
            }]
        )
```

---

## 5. Code Analysis Engine

### 5.1 Semantic Code Search

Uses embeddings to find semantically related code across repositories.

```python
async def semantic_search(query: str, repo_filter: list = None):
    """
    Search code using natural language queries.
    
    Examples:
    - "Find where agent states are managed"
    - "Show me the voicemail routing logic"
    - "Where is the WebRTC connection established?"
    """
    
    # Generate query embedding
    query_embedding = await embedding_model.encode(query)
    
    # Search vector DB
    results = await chroma_collection.query(
        query_embeddings=[query_embedding],
        n_results=20,
        where={"repo": {"$in": repo_filter}} if repo_filter else None
    )
    
    # Rerank by relevance
    reranked = await rerank_results(query, results)
    
    return reranked
```

### 5.2 Cross-Service Tracing

Traces call flows across microservices.

```python
async def trace_call_flow(entry_point: str, repo: str):
    """
    Trace how a call flows through the system.
    
    Example:
    trace_call_flow('handleIncomingCall', 'voice-connector')
    
    Returns:
    - Service call graph
    - Event sequence
    - Data transformations
    """
    
    # Find the entry function
    entry = await find_function(entry_point, repo)
    
    # Trace outgoing calls
    calls = []
    queue = [entry]
    visited = set()
    
    while queue:
        func = queue.pop(0)
        if func.id in visited:
            continue
        visited.add(func.id)
        
        # Find function calls within this function
        for call in func.calls:
            target = await resolve_call_target(call)
            calls.append({
                'from': func,
                'to': target,
                'event_type': call.event_type,
                'data': call.data_payload
            })
            queue.append(target)
    
    return build_call_graph(calls)
```

### 5.3 Static Analysis

Detects common issues without running code.

```python
class StaticAnalyzer:
    async def analyze_repo(self, repo: Repository) -> AnalysisResult:
        issues = []
        
        # Check for common patterns
        issues.extend(await self.check_error_handling(repo))
        issues.extend(await self.check_async_patterns(repo))
        issues.extend(await self.check_security_issues(repo))
        issues.extend(await self.check_performance_issues(repo))
        issues.extend(await self.check_convention_violations(repo))
        
        return AnalysisResult(issues=issues)
    
    async def check_error_handling(self, repo):
        """Find functions missing try/catch"""
        issues = []
        for func in repo.get_async_functions():
            if not func.has_error_handling:
                issues.append({
                    'type': 'missing_error_handling',
                    'severity': 'high',
                    'file': func.file,
                    'line': func.line,
                    'function': func.name,
                    'message': f"Async function '{func.name}' lacks error handling"
                })
        return issues
    
    async def check_security_issues(self, repo):
        """Find security vulnerabilities"""
        issues = []
        # Check for hardcoded secrets
        # Check for SQL injection risks
        # Check for XSS vulnerabilities
        # Check for insecure dependencies
        return issues
```

---

## 6. Issue Detection & Troubleshooting

### 6.1 Issue Detection Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Report │────→│   Analyze    │────→│   Search     │
│   (Slack)    │     │   Intent     │     │   Context    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                    ┌─────────────────────────────┘
                    │
                    ▼
           ┌──────────────┐
           │  Fetch Logs  │
           │  & Traces    │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐     ┌──────────────┐
           │  Cross-Ref   │────→│  Identify    │
           │  with Code   │     │  Root Cause  │
           └──────────────┘     └──────┬───────┘
                                       │
                                       ▼
           ┌─────────────────────────────────────────┐
           │          Generate Diagnosis              │
           │  • Root cause analysis                   │
           │  • Affected services                     │
           │  • Suggested fix                         │
           │  • Related Jira tickets                  │
           └─────────────────────────────────────────┘
```

### 6.2 Example: Voicemail Bug Investigation

**User Report:** *"Voicemail recordings are not appearing in agent desk"*

**DevBot Investigation:**

```python
async def investigate_voicemail_issue():
    # 1. Search for voicemail-related code
    voicemail_code = await semantic_search(
        "voicemail recording upload agent desk",
        repo_filter=['voice-connector', 'cx-core', 'agent-desk']
    )
    
    # 2. Trace the flow
    flow = await trace_call_flow(
        'handleVoicemailUpload',
        'voice-connector'
    )
    
    # 3. Check recent commits
    commits = await gitlab.list_commits(
        'voice-connector',
        branch='master',
        since='1 week ago'
    )
    
    # 4. Check Jira tickets
    tickets = await jira_search_issues(
        'project = CCC AND text ~ "voicemail"'
    )
    
    # 5. Analyze
    diagnosis = await analyze_issue({
        'code': voicemail_code,
        'flow': flow,
        'commits': commits,
        'tickets': tickets
    })
    
    return {
        'root_cause': diagnosis.root_cause,
        'affected_files': diagnosis.files,
        'suggested_fix': diagnosis.fix,
        'confidence': diagnosis.confidence
    }
```

### 6.3 Troubleshooting Output Format

```markdown
## 🔍 Issue Diagnosis: Voicemail Not Appearing in Agent Desk

### Root Cause
The `VOICEMAIL_ENDED` event is not being sent from Voice Connector to CX Core 
because the event handler was removed in commit `abc1234` (PR #567).

### Affected Services
- **Voice Connector** (`src/handlers/voicemail.js`)
- **CX Core** (`src/activities/voicemail.js`)
- **Agent Desk** (`src/components/VoiceMailBox.tsx`)

### Evidence
1. **Missing event handler** in `voice-connector/src/handlers/index.js:45`
   - Line 45: `// handleVoicemailEnded` — commented out
   
2. **CX Core expects event** in `cx-core/src/activities/voicemail.js:23`
   - Listens for `VOICEMAIL_ENDED` but never receives it
   
3. **Recent change** — Commit `abc1234` (May 15, 2026)
   - PR #567 refactored event handlers
   - Removed voicemail handler by mistake

### Suggested Fix
```javascript
// voice-connector/src/handlers/index.js
import { handleVoicemailEnded } from './voicemail';

export const eventHandlers = {
  // ... other handlers
  VOICEMAIL_ENDED: handleVoicemailEnded,  // Add this back
};
```

### Confidence: 95%

### Related Tickets
- CCC-2239: Implement Voice Mail Changes on VC
- CCC-2245: Voicemail not appearing in mailbox
```

---

## 7. Feature Planning Module

### 7.1 Feature Planning Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Feature    │────→│   Analyze    │────→│   Search     │
│   Request    │     │ Requirement  │     │   Codebase   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                    ┌─────────────────────────────┘
                    │
                    ▼
           ┌──────────────┐     ┌──────────────┐
           │   Identify   │────→│   Generate   │
           │   Services   │     │ Architecture │
           └──────────────┘     └──────┬───────┘
                                       │
                    ┌──────────────────┘
                    │
                    ▼
           ┌──────────────┐     ┌──────────────┐
           │  Breakdown   │────→│   Generate   │
           │    Tasks     │     │     PRD      │
           └──────────────┘     └──────┬───────┘
                                       │
                                       ▼
           ┌─────────────────────────────────────────┐
           │          Create Jira Epic + Stories      │
           │          Create Branch + Draft MR        │
           └─────────────────────────────────────────┘
```

### 7.2 Example: Plan Voicemail Feature

**Feature Request:** *"Add voicemail capability for VIP customers with private advisors"*

**DevBot Planning:**

```python
async def plan_voicemail_feature():
    # 1. Analyze requirement
    analysis = await analyze_requirement("""
    VIP customers have dedicated private advisors.
    When advisor is unavailable, customer should be able to leave voicemail.
    Advisor should be notified and able to listen + callback.
    """
    )
    
    # 2. Search codebase for related patterns
    related = await semantic_search("""
    Find code related to:
    - Call routing when agent unavailable
    - Recording voice calls
    - Agent notification system
    - Private advisor / dedicated agent
    - Media server call transfer
    """,
    repo_filter=['voice-connector', 'cx-core', 'routing-engine', 
                 'agent-desk', 'media-server']
    )
    
    # 3. Identify affected services
    services = {
        'voice-connector': {
            'changes': ['Add voicemail flag handling', 
                       'Transfer to voicemail DN',
                       'Send VOICEMAIL_STARTED/ENDED events'],
            'files': ['src/handlers/callRouting.js',
                     'src/handlers/voicemail.js',
                     'src/config/channelSettings.js']
        },
        'cx-core': {
            'changes': ['Create voicemail activity',
                       'Handle VOICEMAIL events',
                       'Store recording metadata'],
            'files': ['src/activities/voicemail.js',
                     'src/events/voiceEvents.js',
                     'src/models/activity.js']
        },
        'routing-engine': {
            'changes': ['Add voicemail flag to NO_AGENT_AVAILABLE',
                       'Private advisor routing logic'],
            'files': ['src/routing/namedAgent.js',
                     'src/events/agentReservation.js']
        },
        'agent-desk': {
            'changes': ['Add voicemail mailbox panel',
                       'Inline playback',
                       'Notification toast',
                       'Callback action'],
            'files': ['src/components/VoiceMailBox.tsx',
                     'src/components/NotificationCenter.tsx',
                     'src/actions/voicemail.ts']
        },
        'unified-admin': {
            'changes': ['Add voicemail DN to channel settings',
                       'Private advisor flag'],
            'files': ['src/pages/ChannelSettings.tsx',
                     'src/pages/AgentMapping.tsx']
        },
        'conversation-studio': {
            'changes': ['Named agent request node',
                       'Voicemail decision node'],
            'files': ['src/nodes/NamedAgentNode.tsx',
                     'src/nodes/VoicemailNode.tsx']
        }
    }
    
    # 4. Generate architecture diagram
    architecture = await generate_architecture(services)
    
    # 5. Breakdown tasks
    tasks = [
        {
            'id': 'VM-1',
            'title': 'Add voicemail flag to channel settings',
            'service': 'unified-admin',
            'effort': '2 days',
            'dependencies': []
        },
        {
            'id': 'VM-2',
            'title': 'Add private advisor flag to routing',
            'service': 'routing-engine',
            'effort': '3 days',
            'dependencies': ['VM-1']
        },
        {
            'id': 'VM-3',
            'title': 'Implement voicemail routing in Voice Connector',
            'service': 'voice-connector',
            'effort': '5 days',
            'dependencies': ['VM-2']
        },
        {
            'id': 'VM-4',
            'title': 'Create voicemail activity in CX Core',
            'service': 'cx-core',
            'effort': '4 days',
            'dependencies': ['VM-3']
        },
        {
            'id': 'VM-5',
            'title': 'Build voicemail mailbox in Agent Desk',
            'service': 'agent-desk',
            'effort': '5 days',
            'dependencies': ['VM-4']
        },
        {
            'id': 'VM-6',
            'title': 'Add voicemail nodes to Conversation Studio',
            'service': 'conversation-studio',
            'effort': '3 days',
            'dependencies': ['VM-2']
        }
    ]
    
    # 6. Generate PRD
    prd = await generate_prd(analysis, services, tasks)
    
    # 7. Create Jira epic
    epic = await jira_create_issue(
        project='CCC',
        summary='Voicemail Feature - Phase 1',
        description=prd.summary,
        issuetype='Epic'
    )
    
    # 8. Create stories
    for task in tasks:
        await jira_create_issue(
            project='CCC',
            summary=task['title'],
            description=prd.get_story_description(task),
            issuetype='Story',
            parent_key=epic.key
        )
    
    return {
        'analysis': analysis,
        'architecture': architecture,
        'tasks': tasks,
        'prd': prd,
        'epic': epic
    }
```

---

## 8. Implementation Pipeline

### 8.1 Auto-Implementation Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Approved    │────→│   Create     │────→│   Read       │
│   Story      │     │   Branch     │     │   Context    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                    ┌─────────────────────────────┘
                    │
                    ▼
           ┌──────────────┐     ┌──────────────┐
           │   Generate   │────→│   Write      │
           │    Code      │     │    Files     │
           └──────────────┘     └──────┬───────┘
                                       │
                    ┌──────────────────┘
                    │
                    ▼
           ┌──────────────┐     ┌──────────────┐
           │    Run       │────→│   Create     │
           │    Tests     │     │   Merge Req  │
           └──────────────┘     └──────┬───────┘
                                       │
                                       ▼
           ┌─────────────────────────────────────────┐
           │          AI Code Review                  │
           │          Human Review                    │
           │          Merge to Master                 │
           └─────────────────────────────────────────┘
```

### 8.2 Code Generation Strategy

```python
class CodeGenerator:
    async def generate(self, task: Task, context: Context) -> GeneratedCode:
        """
        Generate code by:
        1. Reading existing patterns in the repo
        2. Following established conventions
        3. Generating tests alongside implementation
        4. Adding proper error handling
        5. Including documentation
        """
        
        # Read style guide
        style = await self.get_repo_style(task.repo)
        
        # Find similar implementations
        examples = await self.find_similar_code(
            task.description,
            task.repo
        )
        
        # Generate implementation
        code = await llm.generate_code(
            task=task,
            style=style,
            examples=examples,
            context=context
        )
        
        # Generate tests
        tests = await self.generate_tests(code, task)
        
        # Generate documentation
        docs = await self.generate_docs(code, task)
        
        return GeneratedCode(
            implementation=code,
            tests=tests,
            documentation=docs
        )
```

---

## 9. MCP Server Integration

### 9.1 Required MCP Servers

| Server | Tools | Purpose |
|--------|-------|---------|
| **GitLab MCP** | `get_file_contents`, `create_branch`, `create_merge_request`, `list_commits` | Source code access |
| **Jira MCP** | `search_issues`, `create_issue`, `get_issue`, `create_issue_link` | Ticket management |
| **Confluence MCP** | `search`, `get_page`, `create_page` | Documentation access |
| **GitHub MCP** | `search_code`, `create_pull_request` | External repos |
| **Supabase MCP** | `execute_sql`, `list_tables` | Database queries |
| **Slack MCP** | `post_message`, `search_messages` | Team communication |

### 9.2 MCP Configuration

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gitlab"],
      "env": {
        "GITLAB_PERSONAL_ACCESS_TOKEN": "glpat-xxx"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@xuandev/atlassian-mcp",
        "--domain", "expertflow-docs.atlassian.net",
        "--email", "ef.confluence@expertflow.com",
        "--token", "ATATT-xxx"
      ]
    },
    "confluence": {
      "command": "npx",
      "args": ["-y", "@xuandev/atlassian-mcp",
        "--domain", "expertflow-docs.atlassian.net",
        "--email", "ef.confluence@expertflow.com",
        "--token", "ATATT-xxx"
      ]
    }
  }
}
```

---

## 10. Security & Access Control

### 10.1 Access Levels

| Level | Access | Example Users |
|-------|--------|---------------|
| **Read** | Code read, docs read, issues read | All developers |
| **Analyze** | Read + static analysis + troubleshooting | Senior developers |
| **Plan** | Analyze + feature planning + PRD generation | Tech leads |
| **Implement** | Plan + code generation + MR creation | Approved users |
| **Deploy** | Implement + merge + deploy | DevOps |

### 10.2 Security Measures

- ✅ **No secrets in code** — AI never writes hardcoded credentials
- ✅ **Scan all generated code** — SAST + dependency check
- ✅ **Approval gates** — Human review required for all MRs
- ✅ **Audit logging** — All AI actions logged with user attribution
- ✅ **Rate limiting** — Prevent abuse of GitLab API
- ✅ **Scope limitation** — AI only accesses permitted repos/branches

---

## 11. Deployment

### 11.1 Infrastructure

```yaml
# docker-compose.yaml
version: '3.8'

services:
  api-gateway:
    image: devbot/api-gateway:latest
    ports:
      - "8080:8080"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
    
  context-manager:
    image: devbot/context-manager:latest
    environment:
      - REDIS_URL=redis://redis:6379
      - MONGODB_URL=mongodb://mongo:27017/devbot
      
  planner:
    image: devbot/planner:latest
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - CHROMA_URL=http://chroma:8000
      
  executor:
    image: devbot/executor:latest
    environment:
      - GITLAB_TOKEN=${GITLAB_TOKEN}
      - GITLAB_URL=${GITLAB_URL}
      
  validator:
    image: devbot/validator:latest
    environment:
      - SONARQUBE_TOKEN=${SONARQUBE_TOKEN}
      
  chromadb:
    image: chromadb/chroma:latest
    volumes:
      - chroma-data:/chroma/chroma
      
  redis:
    image: redis:7-alpine
    
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db

volumes:
  chroma-data:
  mongo-data:
```

### 11.2 Environment Variables

```env
# API
PORT=8080
JWT_SECRET=your-secret-key
API_RATE_LIMIT=100/minute

# AI
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-xxx
EMBEDDING_MODEL=text-embedding-3-large

# GitLab
GITLAB_URL=https://gitlab.expertflow.com
GITLAB_TOKEN=glpat-xxx

# Jira
JIRA_DOMAIN=expertflow-docs.atlassian.net
JIRA_EMAIL=ef.confluence@expertflow.com
JIRA_TOKEN=ATATT-xxx

# Confluence
CONFLUENCE_DOMAIN=expertflow-docs.atlassian.net
CONFLUENCE_EMAIL=ef.confluence@expertflow.com
CONFLUENCE_TOKEN=ATATT-xxx

# Database
MONGODB_URL=mongodb://localhost:27017/devbot
REDIS_URL=redis://localhost:6379
CHROMA_URL=http://localhost:8000

# Security
SONARQUBE_URL=https://sonar.expertflow.com
SONARQUBE_TOKEN=sqp-xxx
SAST_ENABLED=true
DEPENDENCY_CHECK_ENABLED=true
```

---

## 12. Appendix

### A. Command Examples

```bash
# Start troubleshooting session
devbot troubleshoot "Voicemail not appearing in agent desk"

# Plan a feature
devbot plan "Add callback scheduling for voicemail"

# Search codebase
devbot search "Find where agent states transition from READY to BUSY"

# Implement a story
devbot implement CCC-2239

# Review code
devbot review !567

# Generate architecture diagram
devbot diagram "Show how a call flows from customer to agent"
```

### B. Integration Points

| System | Integration | Data Flow |
|--------|------------|-----------|
| **GitLab** | MCP Server | Code read/write, MR creation |
| **Jira** | MCP Server | Ticket read/create/update |
| **Confluence** | MCP Server | Doc read/create |
| **Slack** | MCP Server | Notifications, commands |
| **OpenSearch** | REST API | Log/traces for debugging |
| **Keycloak** | OAuth2 | Authentication |

### C. Glossary

| Term | Definition |
|------|------------|
| **MCP** | Model Context Protocol — Standard for AI tool integration |
| **MRD** | Media Routing Domain — Groups channels by media type |
| **CCM** | Customer Channel Manager — Manages channel sessions |
| **VC** | Voice Connector — Bridges Media Server ↔ CX Core |
| **RE** | Routing Engine — Finds best agent for calls |
| **ESL** | Event Socket Library — FreeSWITCH protocol |
| **RONA** | Ring On No Answer — Timeout when agent doesn't answer |
| **CIM** | Customer Interaction Management — Message/event format |
| **OTLP** | OpenTelemetry Protocol — Telemetry standard |

---

> **Document Status:** Draft  
> **Next Steps:**
> 1. Review with architecture team
> 2. Set up GitLab MCP server
> 3. Index existing repositories
> 4. Build MVP for voice-mail troubleshooting
> 5. Test with CCC-2239 implementation

---

*Built for Expertflow CX Development Team*
