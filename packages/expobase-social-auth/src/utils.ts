import {
  type SupabaseCreateUser,
  type SupabaseGetUser,
  type SupabaseReducerActions,
  type SupabaseReducerState,
  type SupabaseUserType,
} from './index.d';

export async function getUserByEmail({
  supabaseClient,
  email,
}: SupabaseGetUser): Promise<SupabaseUserType | null> {
  const { data, error } = await supabaseClient
    .from('users')
    .select('id, email, name, created_at')
    .eq('email', email)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function createUser({
  supabaseClient,
  email,
  name,
}: SupabaseCreateUser): Promise<SupabaseUserType | null> {
  const { data, error } = await supabaseClient
    .from('users')
    .insert({
      email,
      name,
    })
    .select('id, email, name, created_at');

  if (error) {
    console.error(error);
    return null;
  }

  return data as unknown as SupabaseUserType;
}

export function extractParamsFromUrl(url: string) {
  const params = new URLSearchParams(url.split('#')[1]);
  const data = {
    access_token: params.get('access_token'),
    expires_in: parseInt(params.get('expires_in') || '0'),
    refresh_token: params.get('refresh_token'),
    token_type: params.get('token_type'),
    provider_token: params.get('provider_token'),
  };

  return data;
}

export function supabaseReducer(state: SupabaseReducerState, action: SupabaseReducerActions) {
  if (action.type === 'set_login') {
    return {
      ...state,
      loggedIn: action.payload,
    };
  } else if (action.type === 'set_loading') {
    return {
      ...state,
      loading: action.payload,
    };
  } else if (action.type === 'set_user') {
    return {
      ...state,
      user: action.payload,
    };
  } else if (action.type === 'set_bundle_id') {
    return {
      ...state,
      redirect: action.payload,
    };
  }

  throw Error('Unknown supabaseReducer action');
}
