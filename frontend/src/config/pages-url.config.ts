class Pages {
    private root = '/home'

    AUTH = '/auth'

    // Base paths
    HOME = this.root
    NEW_RECIPE = `${this.root}/new`
    PROFILE = `${this.root}/profile`

    RECIPE_DETAILS = (id: string) => `${this.root}/${id}`

    get RELATIVE() {
        return {
            AI: 'ai',
            NEW_RECIPE: 'new',
            PROFILE: 'profile',
            RECIPE_DETAILS: (id: string) => id,
        }
    }
}

export const PAGES = new Pages()
