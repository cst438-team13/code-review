import fs from "fs";
import readline from "node:readline/promises";
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

const getPostById = (id: string) =>
  posts.filter((post) => post.postId === id)[0];
const getUserByUsername = (username: string) =>
  users.filter((user) => user.username === username)[0];

const getIsPostVisible = (postId: string, username: string) => {
  const post = getPostById(postId);
  const author = getUserByUsername(post.userId);
  const user = getUserByUsername(username);

  let hasAccess = post.visibility === "public";
  hasAccess = hasAccess || author.username === user.username;
  hasAccess = hasAccess || author.friends.includes(user.username);

  return hasAccess;
};

const entry = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let shouldContinue = true;
  while (shouldContinue) {
    const choice = await rl.question(`
1. Load input data.
2. Check visibility.
3. Retrieve posts.
4. Search users by location.
5. Exit.
Choice: `);

    switch (choice) {
      case "1": {
        let postInfoPath = await rl.question(
          "Path to post-info.txt (data/post-info.txt): "
        );
        let userInfoPath = await rl.question(
          "Path to user-info.txt (data/user-info.txt): "
        );

        if (!postInfoPath) {
          postInfoPath = "data/post-info.txt";
        }
        if (!userInfoPath) {
          userInfoPath = "data/user-info.txt";
        }

        const postInfoFile = (await readFile(postInfoPath)).toString();
        const userInfoFile = (await readFile(userInfoPath)).toString();

        posts = postInfoFile.split("\n").map((line) => {
          const [postId, userId, visibility] = line.split(";");
          const post: Post = {
            postId,
            userId,
            visibility: visibility as any,
          };

          return post;
        });

        users = userInfoFile.split("\n").map((line) => {
          const [username, displayName, state, friendsList] = line.split(";");
          const user: User = {
            username,
            displayName,
            state,
            friends: friendsList.split("[")[1].split("]")[0].split(","),
          };

          return user;
        });

        break;
      }
      case "2": {
        const postId = await rl.question("Post id: ");
        const username = await rl.question("Username: ");

        const isPostVisible = getIsPostVisible(postId, username);
        console.log(isPostVisible ? "Access Permitted" : "Access Denied");

        break;
      }
      case "3": {
        const username = await rl.question("Username: ");
        const visiblePosts = posts.filter((o) =>
          getIsPostVisible(o.postId, username)
        );

        console.log(JSON.stringify(visiblePosts.map((o) => o.postId)));

        break;
      }
      case "4": {
        const state = await rl.question("State: ");
        const usersWithState = users.filter((user) => user.state == state);

        console.log(JSON.stringify(usersWithState.map((o) => o.displayName)));

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
