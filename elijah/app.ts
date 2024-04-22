import fs from "fs";
import readline, {
  type Interface as ReadlineInterface,
} from "node:readline/promises";
import util from "util";

const readFile = util.promisify(fs.readFile);

type User = {
  username: string;
  displayName: string;
  state: string;
  friends: string[];
};

type Post = {
  postId: string;
  userId: string;
  visibility: "public" | "friend";
};

let posts: Post[] = [];
let users: User[] = [];

const findPostById = (id: string) =>
  posts.filter((post) => post.postId === id)[0];

const findUserByUsername = (username: string) =>
  users.filter((user) => user.username === username)[0];

const getIsPostVisible = (postId: string, username: string) => {
  const post = findPostById(postId);
  const author = findUserByUsername(post.userId);
  const user = findUserByUsername(username);

  // Posts are visible if they are public, authored by
  // this user, or are authored by someone who has this user as a friend.
  let hasAccess = post.visibility === "public";
  hasAccess = hasAccess || author.username === user.username;
  hasAccess = hasAccess || author.friends.includes(user.username);

  return hasAccess;
};

// 1. Load input data.
const optionLoadInputData = async (rl: ReadlineInterface) => {
  // Ask for post and user info paths
  let postInfoPath = await rl.question(
    "Path to post-info.txt (data/post-info.txt): "
  );
  let userInfoPath = await rl.question(
    "Path to user-info.txt (data/user-info.txt): "
  );

  // If we don't input specific paths, assume these as the default for convenience
  if (!postInfoPath) {
    postInfoPath = "data/post-info.txt";
  }
  if (!userInfoPath) {
    userInfoPath = "data/user-info.txt";
  }

  // Read both files
  const postInfoFile = (await readFile(postInfoPath)).toString();
  const userInfoFile = (await readFile(userInfoPath)).toString();

  // Map each line to an object of type Post
  posts = postInfoFile.split("\n").map((line) => {
    const [postId, userId, visibility] = line.split(";");
    const post: Post = {
      postId,
      userId,
      visibility: visibility as any,
    };

    return post;
  });

  // Map each line to an object of type User
  users = userInfoFile.split("\n").map((line) => {
    const [username, displayName, state, friendsList] = line.split(";");
    const user: User = {
      username,
      displayName,
      state,
      // Remove braces and turn into an array
      friends: friendsList.split("[")[1].split("]")[0].split(","),
    };

    return user;
  });
};

// 2. Check visibility.
const optionCheckVisibility = async (rl: ReadlineInterface) => {
  const postId = await rl.question("Post id: ");
  const username = await rl.question("Username: ");

  const isPostVisible = getIsPostVisible(postId, username);
  console.log(isPostVisible ? "Access Permitted" : "Access Denied");
};

// 3. Retrieve posts.
const optionRetrievePosts = async (rl: ReadlineInterface) => {
  const username = await rl.question("Username: ");
  const visiblePosts = posts.filter((o) =>
    getIsPostVisible(o.postId, username)
  );

  // Print as JSON-style array
  console.log(JSON.stringify(visiblePosts.map((o) => o.postId)));
};

// 4. Search users by location.
const optionSearchByLocation = async (rl: ReadlineInterface) => {
  const state = await rl.question("State: ");
  const usersWithState = users.filter((user) => user.state == state);

  // Print as JSON-style array
  console.log(JSON.stringify(usersWithState.map((o) => o.displayName)));
};

const entry = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let shouldContinue = true;

  // Continue prompting until exit command is given
  while (shouldContinue) {
    // Ask user to input command
    const command = await rl.question(`
1. Load input data.
2. Check visibility.
3. Retrieve posts.
4. Search users by location.
5. Exit.
Choice: `);

    switch (command) {
      case "1": {
        await optionLoadInputData(rl);
        break;
      }
      case "2": {
        await optionCheckVisibility(rl);
        break;
      }
      case "3": {
        await optionRetrievePosts(rl);
        break;
      }
      case "4": {
        await optionSearchByLocation(rl);
        break;
      }
      case "5": {
        console.log("Done.");
        shouldContinue = false;
      }
    }
  }

  rl.close();
};

entry();
