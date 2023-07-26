# Turborepo: Supabase Social Authentication with Expo Router

[A blog post that explains the process of creating Google/Apple logins with Supabase, accompanies this repository](https://rnny.nl/blog/expo-supabase-social-auth). With this repository, I wanted to give an example and guidance on how to use Supabase Social Authentication together with Expo Router v2. Both Google Authentication as well as Apple Authentication are covered. This repository is built as a monorepo using [Turborepo](https://turbo.build/repo) and [PNpm](https://pnpm.io/).

## How to use

```sh
git clone git@github.com:rnnyrk/social-auth-monorepo.git YOUR_PROJECT
cd YOUR_PROJECT
pnpm i
```

For local development you should also run `pnpm build`, to build the local `/packages` folder. And run `pnmp dev` after to build the Expo app.
If the bundling isn't working directly, first [prebuild](https://docs.expo.dev/workflow/prebuild/) your application:

```sh
cd apps/native
pnpm prebuild
```

_The `pnpm dev` command is configured to bundle an iOS app. If you rather develop by default for Android, change the NPM `dev` script in `apps/native/package.json` to `pnpm android`._

Within the `apps/native` directory, you can find the Expo app. Over there, create an environment file on `.env.development` and fill in the required properties:

```bash
EXPO_PUBLIC_SUPABASE_URL_DEV=
EXPO_PUBLIC_SUPABASE_PUBLIC_KEY_DEV=
EAS_PROJECT_ID=
```

Create a build for a simulator

- iOS `eas build --profile simulator --platform ios`
- Android `eas build --profile development --platform android`

OR Create a build for a device

- iOS `eas device:create` && `eas build --profile development --platform ios`
- Android `eas build --profile development --platform android`

Submit the build:

- iOS `APP_ENV=staging eas submit -p ios --profile staging`
