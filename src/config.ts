export interface GHTeamLabel{
    team: string;
    label: string;
    comment: string | null | undefined;
}
interface GHIgnoreRules {
    users: string[];
    teams: string[];
}
export interface GHTeamLabelConfig {
    teamLabels: GHTeamLabel[]
    ignore: GHIgnoreRules
}
const EMPTY_CONFIG: GHTeamLabelConfig = {
    teamLabels: [],
    ignore: {
        users: [],
        teams: []
    }
}

export async function getConfig(context: any): Promise<GHTeamLabelConfig> {
    const config = await context.config('gh-team-labels.yml') as GHTeamLabelConfig;
    if (!config) {
        return EMPTY_CONFIG
    }
    if (!config.teamLabels) {
        config.teamLabels = []
    }
    if (!config.ignore) {
        config.ignore = {
            users: [],
            teams: []
        }
    }
    if (!config.ignore.users) {
        config.ignore.users = []
    }
    if (!config.ignore.teams) {
        config.ignore.teams = []
    }
    return config
}
