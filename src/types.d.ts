declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test"
    readonly PUBLIC_URL: string
    readonly REACT_APP_RECAPTCHA_SITE_KEY: string
    readonly REACT_APP_AUTH_API_BASE_URL: string
    readonly REACT_APP_SEARCH_API_BASE_URL: string
    readonly REACT_APP_LEADERBOARD_API_BASE_URL: string
    readonly REACT_APP_USER_API_BASE_URL: string
    readonly REACT_APP_SCORES_API_BASE_URL: string
    readonly REACT_APP_PROFILE_HISTORY_API_BASE_URL: string
    readonly REACT_APP_BANCHO_API_BASE_URL: string
    readonly REACT_APP_USER_RELATIONSHIPS_API_BASE_URL: string
    readonly REACT_APP_ADMIN_PANEL_HOME_URL: string
    readonly REACT_APP_GITHUB_ORG_URL: string
    readonly REACT_APP_TWITTER_URL: string
    readonly REACT_APP_DISCORD_INVITE_URL: string
    readonly REACT_APP_AMPLITUDE_API_KEY: string
    readonly REACT_APP_CLARITY_PROJECT_ID: string
  }
}

declare module "*.avif" {
  const src: string
  export default src
}

declare module "*.bmp" {
  const src: string
  export default src
}

declare module "*.gif" {
  const src: string
  export default src
}

declare module "*.jpg" {
  const src: string
  export default src
}

declare module "*.jpeg" {
  const src: string
  export default src
}

declare module "*.png" {
  const src: string
  export default src
}

declare module "*.webp" {
  const src: string
  export default src
}

declare module "*.svg" {
  import * as React from "react"

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  const src: string
  export default src
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string }
  export default classes
}
