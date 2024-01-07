import {Probot} from "probot";
import {handleIssue} from "./handlers";



export = (app: Probot) => {
    app.on("issues.opened", handleIssue);
    app.on("issues.edited", handleIssue);
    app.on("issues.assigned", handleIssue);
};
