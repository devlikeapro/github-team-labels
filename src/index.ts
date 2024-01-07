import {Context, Probot} from "probot";
import {Octokit} from "@octokit/core";
import {isMemberOf} from "./utils";

async function getFirstSuitableLabel(
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

async function handleIssue(context: Context<'issues'>) {
    const config = await context.config<GHTeamLabelConfig>('gh-team-labels.yml')
    if (!config) {
        return
    }
    const createdByUser = context.payload.issue.user
    const orgName = context.payload.repository.owner.login
    const currentLabels = context.payload.issue.labels?.map(label => label.name) || []
    const label: string | null = await getFirstSuitableLabel(context.octokit, config, orgName, createdByUser.login, currentLabels)
    if (label) {
        await context.octokit.issues.addLabels(context.issue({labels: [label]}))
    }
}


export = (app: Probot) => {
    app.on("issues.opened", handleIssue);
    app.on("issues.edited", handleIssue);
    app.on("issues.assigned", handleIssue);
};
