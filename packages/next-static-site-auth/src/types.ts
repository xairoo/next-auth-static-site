export type tokenType = string | null | undefined;

export type dataType = any | object | null | undefined;

export type InitialStateProps =
  | {
      status: undefined | string;
      token: tokenType;
      data: dataType;
    }
  | any;

export type ReducerActionProps = {
  type: string;
  payload: {
    token: tokenType;
    data: dataType;
  };
};

export type SessionProviderProps = {
  children: React.ReactNode;
};

export interface Session {
  status: undefined | string;
  data: dataType;
  token: tokenType;
}

export type LoginOptions = {
  body: object;
  url?: string;
  callbackUrl?: boolean | string;
};

export type LoginUrlOptions = {
  pathname?: string;
  callbackUrl?: string | false;
};

export interface UseLoginReturn {
  ok: boolean;
  status: null | number;
  error: undefined | string;
  callbackUrl: null | string;
}

export type LogoutOptions = {
  apiRequest?: boolean;
  callbackUrl?: string;
};

export interface UseLogoutReturn {
  ok: boolean;
  status: null | number;
  error: undefined | string;
}
