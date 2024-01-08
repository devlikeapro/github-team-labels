import {Octokit} from "@octokit/core";
import {GHTeamLabel, GHTeamLabelConfig} from "./config";
import {RequestError} from "@octokit/request-error";

export async function isMemberOf(octokit: Octokit, orgName: string, userName: string, teamSlug: string): Promise<boolean> {
    try {
        const teamResponse = await octokit.request('GET /orgs/{org}/teams/{team_slug}/memberships/{username}', {
            org: orgName,
            team_slug: teamSlug,
            username: userName
        })
        return teamResponse.status === 200
    }
    catch (err) {
        if ((err instanceof RequestError) && (err.status === 404)) {
            return false
        }
        throw err
    }
}

export async function getFirstSuitableLabel(
    octokit: Octokit,
    config: GHTeamLabelConfig,
    orgName: string,
    userName: string,
    currentLabels: string[],
): Promise<GHTeamLabel | null> {
    // Check ignore rules - users
    if (config.ignore.users.includes(userName)) {
        return null
    }
    // Check ignore rules - teams
    for (const teamSlug of config.ignore.teams) {
        const isMember = await isMemberOf(octokit, orgName, userName, teamSlug)
        if (isMember) {
            return null
        }
    }

    // Check team labels
    for (const teamLabel of config.teamLabels) {
        if (currentLabels.includes(teamLabel.label)) {
            return teamLabel
        }
        const isMember = await isMemberOf(octokit, orgName, userName, teamLabel.team)
        if (isMember) {
            return teamLabel
        }
    }
    return null
}

