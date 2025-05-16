import uploadOnColudinary from "../utils/cloudinary.js";
import fetchDb from "../utils/query.js";

async function addPost(req, res) {
  let userid = req.ObtainedData;
  let caption = req.body.caption;
  let imagePath = req.file?.path;
  if (!imagePath) return res.sendStatus(500);
  try {
    let url = await uploadOnColudinary(imagePath);
    if (!url) return res.sendStatus(500);
    let query = `insert into imagepost (userid,imageurl,caption) values (?,?,?)`;
    let data = [userid, url, caption];
    let response = await fetchDb(query, data);
    res.json({
      statusCode: 201,
      msg: "sucess",
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}
async function removePost(req, res) {
  let userid = req.ObtainedData;
  let postid = req.body.namevaluePairs.postid;

  try {
    let query = `delete from imagepost where userid=? and postid=?`;
    let data = [userid, Number(postid)];
    let response = await fetchDb(query, data);
    res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

async function getFeed(req, res) {
  let userid = req.ObtainedData;
  let query = ` select p.*,u.username,u.profilepic, pl.userid as likedBy,count(distinct pl.likeid) as likeCount ,count(distinct post_Comments.commentid) as commentCount,count(distinct ps.shareid) as shareCount ,count (distinct plp.likeid) as isLiked from imagepost as p join users as u  on p.userid=u.userid left join post_likes as pl on p.postid=pl.postid left join post_comments on p.postid=post_comments.postid left join post_shares as ps on p.postid=ps.postid left join post_likes as plp on p.postid=plp.postid and plp.userid=? group by p.postid limit 100
`;

  try {
    let response = await fetchDb(query, [userid]);

    res.json(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { addPost, removePost, getFeed };
