import {Octokit} from "@octokit/core";
import {GHTeamLabelConfig} from "./config";

export async function isMemberOf(octokit: Octokit, orgName: string, userName: string, teamSlug: string): Promise<boolean> {
    const teamResponse = await octokit.request('GET /orgs/{org}/teams/{team_slug}/memberships/{username}', {
        org: orgName,
        team_slug: teamSlug,
        username: userName
    })
    return teamResponse.status === 200
}
export async function getFirstSuitableLabel(
    octokit: Octokit,
    config: GHTeamLabelConfig,
    orgName: string,
    userName: string,
    currentLabels: string[],
): Promise<string | null> {
    for (const teamLabel of config.teamLabels) {
        if (currentLabels.includes(teamLabel.label)) {
            return teamLabel.label
        }
        const isMember = await isMemberOf(octokit, orgName, userName, teamLabel.team)
        if (isMember) {
            return teamLabel.label
        }
    }
    return null
}

