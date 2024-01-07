import {Context, Probot} from "probot";
import { Octokit } from "@octokit/core";

async function handleIssue(context: Context<'issues'>) {
    const config = await context.config<GHTeamLabelConfig>('gh-team-labels.yml')
    if (!config) {
        return
    }
    const createdByUser = context.payload.issue.user
    const orgName = context.payload.repository.owner.login
    const labels = []
    for (const teamLabel of config.teamLabels) {
        const isMember = await isMemberOf(context.octokit, orgName, createdByUser.login, teamLabel.team)
        if (isMember) {
            labels.push(teamLabel.label)
        }
    }
    await context.octokit.issues.addLabels(context.issue({labels: labels}))
}

async function isMemberOf(octokit: Octokit, orgName: string, userName: string, teamSlug: string): Promise<boolean> {
    const teamResponse = await octokit.request('GET /orgs/{org}/teams/{team_slug}/memberships/{username}', {
        org: orgName,
        team_slug: teamSlug,
        username: userName
    })
    return teamResponse.status === 200
}


export = (app: Probot) => {
    app.on("issues.opened", handleIssue);
    app.on("issues.edited", handleIssue);
    app.on("issues.assigned", handleIssue);
};
