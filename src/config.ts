interface GHTeamLabel{
    team: string;
    label: string;
}
export interface GHTeamLabelConfig {
    teamLabels: GHTeamLabel[]
}

export async function getConfig(context: any): Promise<GHTeamLabelConfig> {
    return await context.config('gh-team-labels.yml') as GHTeamLabelConfig;
}
