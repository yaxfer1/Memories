export interface Chat {
    id: bigint;
    name: string; 
    messages: string[]; 
    aimessages: string[]; 
}

export interface Company {
    id: bigint;
    name: string;
    memories: Memory[];
}

export interface Memory {
    id: bigint;
    name: string;
    reports: Report[];
    result: string;
}

export interface Report{
    id: bigint;
    name: string;
    tools_result: AgentAction[];
    TEXT1: string;
    TEXT2: string;
    RESULT: string;
}


export interface AgentAction {
    tool: string;
    query: any;
    result: string;
  }

export interface State {
    text1: string;
    text2: string;
    text3: string;
    loading: boolean;
    result: string;
    chat: boolean;
    messages: string[];
    aimessages: string[];
    newMessage: string;
    showModal: boolean;
    editedText: string;
    email: string;
    password: string;
    currentChatId: bigint;
    currentReportId: bigint;
    chats: Chat[];
    jwt: string;
    companies: Company[];
    newCompanyName: string;
    newMemoryName: string;
    selectedCompanyId: bigint;
    selectedMemoryId: bigint;
    submittedUrls: string[];
    files: File[];
    pdfFilenames: string[];
    actions: AgentAction[];
    reports: Report[];
    generatorAdditionalContent: boolean;
    isSelectedBusinessAndMemory: boolean;
    finalMemory: string;
    isFinalMemory: boolean;
    isGeneratedResult: boolean;
    isCollapsed: boolean;
    isNewChat: boolean;
    isRightColumnVisible: boolean;
    rightColumnMode: string;
}

export type Action =
    | { type: 'SET_TEXT1'; payload: string }
    | { type: 'SET_TEXT2'; payload: string }
    | { type: 'SET_TEXT3'; payload: string }
    | { type: 'GET_RESULT'; payload: string }
    | { type: 'SET_LOAD'; payload: boolean }
    | { type: 'SET_CHAT'; payload: boolean }
    | { type: 'SET_MESSAGES'; payload: string[] }
    | { type: 'SET_AIMESSAGES'; payload: string[] }
    | { type: 'SET_NEWMESSAGE'; payload: string }
    | { type: 'SET_SHOWMODAL'; payload: boolean }
    | { type: 'SET_EDITEDTEXT'; payload: string }
    | { type: 'SET_EMAIL'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_CURRENTCHATID'; payload: bigint}
    | { type: 'ADD_CHAT'; payload: Chat}
    | { type: 'SET_CHATS'; payload: Chat[]}
    | { type: 'SET_JWT'; payload: string}
    | { type: 'DELETE_CHAT'; payload: bigint } 
    | { type: 'DELETE_REPORT'; payload: bigint } 
    | { type: 'UPDATE_CHAT_MESSAGES'; payload: { currentChatID: bigint; messages: string[] } }
    | { type: 'UPDATE_CHAT_AIMESSAGES'; payload: { currentChatID: bigint; aimessages: string[] } } 
    | { type: 'SET_NEWCOMPANYNAME'; payload: string }
    | { type: 'SET_NEWMEMORYNAME'; payload: string }
    | { type: 'SET_SELECTEDCOMPANY'; payload: bigint}
    | { type: 'SET_SELECTEDMEMORY'; payload: bigint}
    | { type: 'SET_COMPANIES'; payload: Company[] }
    | { type: 'SET_MEMORIES'; payload: {selectedCompany: bigint, memories: Memory[]} }
    | { type: 'SET_SINGLEMEMORY'; payload: Memory }
    | { type: 'SET_SUBMITTEDURLS'; payload: string[] }
    | { type: 'SET_FILES'; payload: File[] }
    | { type: 'SET_PDFFILENAMES'; payload: string[] }
    | { type: 'SET_ACTIONS'; payload: AgentAction[] }
    | { type: 'SET_REPORTS'; payload: Report[] }
    | { type: 'ADD_REPORT' ; payload: Report}
    | { type: 'SET_CURRENTREPORTID' ; payload: bigint}
    | { type: 'SET_ADDITIONALCONTENTGENERATOR'; payload: boolean}
    | { type: 'SET_ISSELECTEDCOMPANYANDMEMORY'; payload: boolean}
    | { type: 'SET_FINALMEMORY'; payload: string}
    | { type: 'SET_ISFINALMEMORY'; payload: boolean}
    | { type: 'SET_ISGENERATEDRESULT'; payload: boolean}
    | { type: 'SET_SINGLEREPORT'; payload: Report}
    | { type: 'SET_ISCOLLAPSED'; payload: boolean }
    | { type: 'SET_ISNEWCHAT'; payload: boolean }
    | { type: 'SET_RIGHTCOLUMNVISIBLE'; payload: boolean }
    | { type: 'SET_RIGHTCOLUMNMODE'; payload: string }

export enum SectionType {
    Box1 = 'box1',
    Box2 = 'box2',
    Box3 = 'box3',
}

declare module './components/DropdownMenu.jsx' {
    const value: never;
    export default value;
}

//declare module './hooks/useUser.ts' {
//    const value: never;
//    export default value;
//}
