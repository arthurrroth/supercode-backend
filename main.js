import fs from 'node:fs/promises';

const postsPath = new URL('./data/posts.js', import.meta.url);
const fullPostsPath = new URL('./data/fullPosts.js', import.meta.url);
const commentsPath = new URL('./data/comments.js', import.meta.url);


const fetchData = async (url) => {

  try {

    const response = await fetch(url);
    const data = await response.json();
    return data

  } catch (error) {
      console.log('Error while fetching data:', error);
  }

};

const Init = async () => {
  // Lvl 1: Collect all Posts
  const basePosts = await fetchData('https://jsonplaceholder.typicode.com/posts');
  const basePostsString = JSON.stringify(basePosts, null, 2);
  await fs.writeFile(postsPath, basePostsString, (err) => {
      err ? console.log('error') : console.log('Success');
    });

  // Lvl 2: Collect all Comments
  let comments = [];
  for (let post of basePosts) {
    const commentsArr = await fetchData(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
    commentsArr.map((comment) => {
      comments.push(comment);
    });
  };
  const commentsString = JSON.stringify(comments, null, 2);
  await fs.writeFile(commentsPath, commentsString,  (err) => {
      err ? console.log('error') : console.log('Success');
    });
  
  // Lvl 3: Merge Comments with Posts
  for (let post of basePosts) {
    const commentsArr = await fetchData(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
    post.comments = commentsArr;
  };
  const fullPostsString = JSON.stringify(basePosts, null, 2);
  await fs.writeFile(fullPostsPath, fullPostsString, (err) => {
      err ? console.log('error') : console.log('Success');
    });


};

await Init();
