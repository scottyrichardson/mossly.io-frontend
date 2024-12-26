const core = require("@actions/core");
const { exec } = require("@actions/exec");
const aws = require("@aws-sdk/client-ecr");

async function run() {
  try {
    // Configure AWS
    const credentials = {
      accessKeyId: core.getInput("aws-access-key-id", { required: true }),
      secretAccessKey: core.getInput("aws-secret-access-key", {
        required: true,
      }),
    };
    const region = core.getInput("aws-region", { required: true });
    const ecrClient = new aws.ECR({ credentials, region });

    // Get auth token and login
    const authData = await ecrClient.getAuthorizationToken({});
    const [username, password] = Buffer.from(
      authData.authorizationData[0].authorizationToken,
      "base64"
    )
      .toString()
      .split(":");
    const registry = authData.authorizationData[0].proxyEndpoint;

    await exec("docker", ["login", "-u", username, "-p", password, registry]);

    // Get other inputs
    const repository = core.getInput("repository", { required: true });
    const tags = core.getInput("tags", { required: true }).split(",");
    const dockerfilePath = core.getInput("dockerfile-path") || ".";
    const buildArgs = core.getInput("build-args");

    // Process build arguments
    const buildArgsArray = [];
    if (buildArgs) {
      buildArgs.split(",").forEach((arg) => {
        buildArgsArray.push("--build-arg", arg.trim());
      });
    }

    // Construct tag arguments
    const tagArgs = tags
      .map((tag) => [
        "-t",
        `${registry.replace("https://", "")}/${repository}:${tag.trim()}`,
      ])
      .flat();

    // Build image
    core.startGroup("Building Docker image");
    await exec("docker", [
      "build",
      ...buildArgsArray,
      ...tagArgs,
      dockerfilePath,
    ]);
    core.endGroup();

    // Push each tag
    core.startGroup("Pushing Docker image");
    for (const tag of tags) {
      const imageTag = `${registry.replace(
        "https://",
        ""
      )}/${repository}:${tag.trim()}`;
      core.info(`Pushing ${imageTag}`);
      await exec("docker", ["push", imageTag]);
    }
    core.endGroup();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
