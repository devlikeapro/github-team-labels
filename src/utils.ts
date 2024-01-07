import {Octokit} from "@octokit/core";

export async function isMemberOf(octokit: Octokit, orgName: string, userName: string, teamSlug: string): Promise<boolean> {
    const teamResponse = await octokit.request('GET /orgs/{org}/teams/{team_slug}/memberships/{username}', {
        org: orgName,
        team_slug: teamSlug,
        username: userName
    })
    return teamResponse.status === 200
}
