import {Context, Probot} from "probot";

async function handleIssue(context: Context) {
    const config = await context.config<GHTeamLabelConfig>('gh-team-labels.yml')
    if (!config) {
        return
    }
    const labels = config.teamLabels.map((teamLabel) => teamLabel.label)
    await context.octokit.issues.addLabels(context.issue({labels: labels}))
}


export = (app: Probot) => {
    app.on("issues.opened", handleIssue);
    app.on("issues.edited", handleIssue);
};
