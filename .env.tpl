# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to `.env`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.
#
# TODO: Update the docs to explain how tf the 1Password CLI works

# When adding additional environment variables, the schema in "/src/env.js"
# should be updated accordingly.

# Next Auth
# You can generate a new secret on the command line with:
# npx auth secret
# https://next-auth.js.org/configuration/options#secret
AUTH_SECRET="op://CourseFull/coursefull_v2_${APP_ENV:-dev}/auth/AUTH_SECRET"

# Next Auth Discord Provider
AUTH_DISCORD_ID="op://CourseFull/coursefull_v2_dev/auth/AUTH_DISCORD_ID"
AUTH_DISCORD_SECRET="op://CourseFull/coursefull_v2_dev/auth/AUTH_DISCORD_SECRET"

# Drizzle
DATABASE_URL="postgresql://{{ op://CourseFull/coursefull_v2_${APP_ENV:-dev}/database/DATABASE_USERNAME }}:{{ op://CourseFull/coursefull_v2_${APP_ENV:-dev}/database/DATABASE_PASSWORD }}@{{ op://CourseFull/coursefull_v2_${APP_ENV:-dev}/database/DATABASE_HOST}}:{{ op://CourseFull/coursefull_v2_${APP_ENV:-dev}/database/DATABASE_PORT }}/{{ op://CourseFull/coursefull_v2_${APP_ENV:-dev}/database/DATABASE_NAME }}"
