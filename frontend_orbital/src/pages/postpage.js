import React, { useState, useEffect} from "react";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { useAlert } from "react-alert";
import { Reply } from "@material-ui/icons";
import CloseIcon from '@material-ui/icons/Close';
import Linkify from 'react-linkify';
import { CssBaseline,AppBar, Toolbar, Box } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Backdrop } from "@material-ui/core";
import { Fade } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import { CardActionArea } from "@material-ui/core";
import { CardHeader } from "@material-ui/core";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import { Container } from "@material-ui/core";
import ThumbUp from "@material-ui/icons/ThumbUp";
import { ThumbDown } from "@material-ui/icons";
import { Edit } from "@material-ui/icons";
import { Delete } from "@material-ui/icons";
import { Comment } from "@material-ui/icons";
import { Alert, AlertTitle } from '@material-ui/lab';
import Void from '../images/void.svg';

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        paddingTop: "50px",
        justifyContent:'center',
        flexDirection:"column",
        backgroundColor:"#E4D7D1"
    },
    root: {
        maxWidth: 1000,
        flexDirection: "column",
        marginBottom: 20,
        backgroundColor:"#DFDDD9"
    },

    commentroot : {
        maxWidth: 800,
        marginBottom: 30,
        backgroundColor:'#DFDDD9'
    },

    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    topimg: {
        marginTop: "100px",
        height: "30vh",
        width: "auto",
        marginBottom: "0",
    },
    paper: {
        width: 550,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 25,
        fontWeight: 1000,
    },
    pos: {
        marginBottom: 12,
    },
    footer : {
        listStyle: "none"
    },
    line :{
        marginBottom:12,
    },
    form :  {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            maxWidth: '40ch',
        },
    },

    header : {
        backgroundColor: "#331A1A",
        width: "100%",
        alignItems: 'stretch',
        flexDirection: 'column',
        flexGrow: 1,
    },
    headerTitle : {
        color:"#D7745A",
    },

    appBar : {
        position:"relative",
    }
    }));


export default function Thread({ match, location, id }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const [user, setUser] = useState({});
    const [username, setUsername]  = useState("");
    const [isStaff, setIsStaff] = useState(false);
    const [user_post, setUserPost] = useState({});
    const [post, setPostdata] = useState({});
    const [postDate, setPostDate] = useState([])
    const [comments, setCommentsdata] = useState([]);
    const [commentID, setCommentID] = useState("");
    const [comment, setComment] = useState({});
    const [replies, setReplies] = useState([]);
    const [reply, setReply] = useState({})
    const [replyID, setReplyID] = useState("");
    const [content, setContent] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [answerer, setAnswerer] = useState({});
    const [answer, setAnswer] = useState("");
    const [postEdit, setPostEdit] = useState("");
    const [postTitleEdit, setPostTitleEdit] = useState("");
    const [commentEdit, setCommentEdit] = useState("");
    const [replyEdit, setReplyEdit] = useState("");
    const [modal, setModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [upvote, setUpvote] = useState(false);
    const [downvote, setDownVote] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteReplyOpen, setDeleteReplyOpen] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [like, setLike] = useState(0);
    const [dislike, setDislike] = useState(0);
    const [editCommOpen, setEditCommOpen] = useState(false);
    const [editRepOpen, setRepOpen] = useState(false);
    const [repliesUsers, setRepliesUsers] = useState({});
    const [commentsUsers, setCommentsUsers] = useState({});
    const alert = useAlert();

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );

    const [scroll, setScroll] = React.useState('paper');
  
    const handleEditComOpen = () => {
        setEditCommOpen(true);
    };

    const handleEditComClose = () => {
        setEditCommOpen(false);
    };

    const handleEditRepOpen = () => {
        setRepOpen(true);
    }

    const handleEditRepClose = () => {
        setRepOpen(false);
    }

    const handleModalOpen = (scrollType) => {
      setModal(true);
      setScroll(scrollType);
    };

    const handleModalClose = () => {
        setModal(false);
    }

    const handleEditOpen = () => {
        setEditOpen(true);
      };
  
    const handleEditClose = () => {
        setEditOpen(false);
    }
     
    const handleDeleteReplyOpen = () => {
        setDeleteReplyOpen(true);
    };
  
  
    const handleDeleteReplyClose = () => {
        setDeleteReplyOpen(false);
    }
      
    const descriptionElementRef = React.useRef(null);

    useEffect(() => {
    if (modal) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [modal]);


    useEffect(() => {
        if (isLoggedIn) {
            fetch("http://studymate.pythonanywhere.com/server/current_user/", {
                headers: {
                    Authorization: `JWT ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    setUsername(json.username);
                    setIsStaff(json.is_staff);
                });
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        axios
            .get(
                `http://studymate.pythonanywhere.com/server/postcomment/${match.params.postID}/`
            )
            .then((res) => {
                console.log(res.data);
                setCommentsdata(res.data);
                setLoading(false);
                const commentusers = {};
                res.data.map((comment) => {
                    const userid = comment.userID;
                    axios
                    .get(`http://studymate.pythonanywhere.com/server/getuserbyID/${userid}/`)
                    .then((res) => {
                        commentusers[userid] = res.data.username;
                        
                    })
                    .catch((error) => console.log(error));
                })
                console.log(commentusers)
                setCommentsUsers(commentusers);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        axios
            .get(
                `http://studymate.pythonanywhere.com/server/viewpost/${match.params.postID}/`
            )
            .then((res) => {
                console.log(res.data);
                setPostdata(res.data);
                const date = (res.data.creationDate).split("T")[0]
                setPostDate(date);
                setLike(res.data.upvote);
                setDislike(res.data.downvote);
                setLoading(false);
                getUserPost();
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const getPosts = () => {
        axios
            .get(
                `http://studymate.pythonanywhere.com/server/viewpost/${match.params.postID}/`
            )
            .then((res) => {
                console.log(res.data);
                setPostdata(res.data);
                setLike(res.data.upvote);
                setDislike(res.data.downvote);
                setLoading(false);
                getUserPost();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    const getComments = () => {
        axios
            .get(
                `http://studymate.pythonanywhere.com/server/postcomment/${match.params.postID}/`
            )
            .then((res) => {
                console.log(res.data);
                setCommentsdata(res.data);
                setLoading(false);
                const commentusers = {};
                res.data.map((comment) => {
                    const userid = comment.userID;
                    axios
                    .get(`http://studymate.pythonanywhere.com/server/getuserbyID/${userid}/`)
                    .then((res) => {
                        commentusers[userid] = res.data.username;
                    })
                    .catch((error) => console.log(error));
                })
                console.log("a" + commentusers)
                setCommentsUsers(commentusers);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getReplies = (commentid) => {
        axios
        .get(
            `http://studymate.pythonanywhere.com/server/commentanswer/${commentid}/`)
            .then((res) => {
                setReplies(res.data);
                setReplyID(id);
                setLoading(false);
                setCommentID(commentid);
                var userreply = new Object();;
                res.data.map((reply) => {
                    const userid = reply.userID;
                    axios
                    .get(`http://studymate.pythonanywhere.com/server/getuserbyID/${userid}/`)
                    .then((res) => {
                        userreply[userid] = res.data.username;
                        setRepliesUsers(userreply)
                    })
                    .catch((error) => console.log(error));
                })
            });
        }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    const handleSubmitComment = () =>
        axios
        .post(
        `http://studymate.pythonanywhere.com/server/createcomment/`,
        {
            postID: match.params.postID,
            userID : id,
            textContent : content,
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {
        console.log(res);
        console.log(res.data);
        handleOpen();
        setContent("");
        getComments();
    })
    .catch((err) => {
        if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Your session has expired. Please Log In again to answer this question");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });


    const handleSubmitCommentAns = () => {
        axios
        .post(`
        http://studymate.pythonanywhere.com/server/createreply/`,
        {
            postID: match.params.postID,
            userID : id,
            textContent : replyContent,
            commentID :commentID,
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
    )
    .then((res) => {

        console.log(res);
        console.log(res.data);
        setReplyContent("");
        setCommentID("");
        getReplies();
    })
    .catch((err) => {
        if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Your session has expired. Please Log In again to comment this answer");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });
    }
    
    const handleUpvote = (userID, postID) => {
    axios
    .post(`http://studymate.pythonanywhere.com/server/upvotepost/`, 
    {
        userID : id,
        postID : match.params.postID,
        
    },
    {
        headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
        },
    }
    )
    .then(
        res => {
            console.log(res);
            console.log('Update Complete');  
            setPost(res.data);
            setLike(res.data.upvote);
        })
       .catch((err) => { if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Please Log In to vote this post");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });
    }


    const handleDownvote = () => {
        axios
        .post(`http://studymate.pythonanywhere.com/server/downvotepost/`, 
        {
            postID : match.params.postID,
            userID : id
        },
        {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        }
        )
        .then(
            res => {
                console.log('Update Complete'); 
                console.log(res);
                setPost(res.data);
                setDislike(res.data.downvote);
            })
        .catch((err) => { if (
            err.response.status === 401 ||
            err.response.status === 404
        ) {
            alert.show("Please Log In to vote this post");
        } else {
            console.log(err.response);
            console.log(err.response.data.res);
            alert.show(err.response.data.res);
        }
    });
    }
    
    const handleEditComment = e => {
        e.preventDefault();
        axios
            .post('http://studymate.pythonanywhere.com/server/editcomment/',{
                textContent: commentEdit,
                commentID : commentID,
                userID : id,
                postID :  match.params.postID,
            },
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            }
            )
            .then(
                res => {
                    window.location.reload(false);
                    setCommentID("");
                })
            .catch(err =>  {
            console.log(err.response);
            console.log(err.response.data.res);
            getComments();
            alert.show(err.response.data.res);
            })
        }

    
        const handleEditReply = e => {
            e.preventDefault();   
            axios
                .post('http://studymate.pythonanywhere.com/server/editreply/',{
                    textContent: replyEdit,
                    commentID : commentID,
                    replyID : replyID,
                    userID : id,
                    postID :  match.params.postID,
                },
                {
                    headers: {
                        Authorization: "JWT " + localStorage.getItem("token"),
                    },
                }
                )
                .then(
                    res => {
                        window.location.reload(false);
                        setCommentID("");
                        setReplyID("");
                        setReplyEdit("");
                        setReplyContent("");
                        getReplies();
                    })
                .catch(err =>  {
                console.log(err.response);
                console.log(err.response.data.res);
                alert.show(err.response.data.res);
                })
            }

    const onCommentChange = e => {
            setContent(e.target.value)
            setAnswerer(username)
        };

    const handleEditPost = e => {
            e.preventDefault();

            axios
                .post('http://studymate.pythonanywhere.com/server/editpost/',
                {
                    userID : id,
                    textContent: postEdit,
                    title : postTitleEdit,
                    postID: match.params.postID,
                },
                {
                    headers: {
                        Authorization: "JWT " + localStorage.getItem("token"),
                    },
                })
                .then(
                    res => {
                        window.location.reload(false);
                    })
                .catch(err => console.log(err));
        };
    
    
    const setPost = (post,title) => {
            setPostEdit(post);
            setPostTitleEdit(title);
    }
   
    const onPostEditChange = (e) => {
        setPostEdit(e.target.value);
    };

    const onPostTitleEditChange = (e) => {
        setPostTitleEdit(e.target.value);
    };

    const onCommentEditChange = e => {
        e.preventDefault();
        setCommentEdit(e.target.value);
    };

    const onReplyEditChange = e => {
        e.preventDefault();
        setReplyEdit(e.target.value);
    };

    const onReplyChange = (e) => {
        setReplyContent(e.target.value)
        setAnswerer(username)
    }

    
    const handleDelete = (e) => { //deleting post
        e.preventDefault();

        axios
            .delete(`http://studymate.pythonanywhere.com/server/deletepost/${match.params.postID}/${id}/`,
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            })//delete post
            .then(res => {
                if (res.status === 200) {
                    handleDeleteClose(); //close delete post modal
                }
                console.log(res);
                getPosts();
                window.location.reload(false);
            
            })
            .catch(err => console.log(err));
    };

    const handleDeleteComment = (e) => { 

        axios
            .delete(`http://studymate.pythonanywhere.com/server/deletecomment/${commentID}/${id}/`,
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            }) //delete comment
            .then(res => {
                if(res.status === 200) {
                    handleClose();
                }
                getComments();
                console.log(res);
                window.location.reload(false);
                setCommentID("");
            })
            .catch(err => console.log(err));
    };

    
    const handleDeleteReply = (e) => { 

        axios
            .delete(`http://studymate.pythonanywhere.com/server/deletereply/${replyID}/${id}/`,
            {
                headers: {
                    Authorization: "JWT " + localStorage.getItem("token"),
                },
            }) //delete reply
            .then(res => {
                if(res.status === 200) {
                    getReplies(commentID)
                    handleDeleteReplyClose();
                }
                console.log(res);
                getReplies();
                setReplyID("");
                getComments();
            })
            .catch(err => console.log(err));
    };

    
    const getUserPost = () => { 
        
        //get the user who post the question/post
        const postID = match.params.postID; //get post id
        axios
            .get(`http://studymate.pythonanywhere.com/server/postuser/${match.params.postID}/`
            ) //search user who post the question
            .then(res => {
                setUserPost(res.data); //set user_post 
            })
            .catch(err => console.log(err));
    };

    const setReplyAndID = (id, reply) => {
        setReplyID(id);
        setReplyEdit(reply);
    }

    const setCommentAndID = (commentid, ans) => {
        setCommentID(commentid);
        setCommentEdit(ans);
    }

    const refreshPage =() => {
        window.location.reload(false);
    }

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <React.Fragment>
        <CssBaseline />

        <Container maxWidth="false" className={classes.container}>

        <p className="whiteSpace"></p>
        
        <Card className = {classes.root}>
            <CardHeader title={post.title}
            subheader={
            <div className="sub-text">
                     <Typography variant="caption" >
                        @ {`${post.postID}`}
                        &middot; 
                       
                        Posted on {postDate}
                    </Typography>
                            <div>Posted by {user_post.username}</div>
            </div>
            }
             classes={{
                root: classes.header,
                title: classes.headerTitle,
                subheader : classes.headerTitle,
              }}

           
            >
            </CardHeader>
            <hr className="line"></hr>
                    <CardContent>
                    <Typography  variant="body2" component="p" style={{marginBottom:12}}>
                        {post.textContent}
                    </Typography>
                    <ul className={classes.footer}>
                        <li>
                            <Button title="Like"  startIcon={<ThumbUp />} onClick={() => {
                                    setUpvote(true);
                                    handleUpvote(
                                        match.params.postID,
                                        id
                                )}}>
                                {like}
                            </Button>
                            <Button  title="Disike"
                            startIcon={<ThumbDown/>}
                            onClick={() => {
                                setDownVote(true);
                                handleDownvote(
                                    match.params.postID,
                                    id
                                )}}>
                                {dislike}
                            </Button>
                            
                            <Button title="View comments"  data-toggle="modal" 
                            data-target="#commentsPostModal" 
                            startIcon={<Comment/>}>
                                    {post.numOfComments}
                            </Button>
                        
                        </li>
                        <li>
                            {isLoggedIn &&
                                <form className="post pb-4">
                                    <div className="form-row align-items-left mb-3 ml-3">
                                    <TextField
                                        style = {{minWidth:"40ch",maxWidth: "70ch"}}
                                        id="outlined-multiline-static"
                                        label="Comment.."
                                        multiline
                                        rows={5}
                                        defaultValue="Default Value"
                                        variant="outlined"
                                        placeholder="What are your thoughts? "
                                        value={content}
                                        onChange={onCommentChange}
                                        disabled={!isLoggedIn}
                                        required />
                                    </div>
                                    <small className="form-text text-muted col-sm-11">
                                        Inappropriate or irrelevant answers will be filtered accordingly.
                                    </small>       
                                    
                                    <br />
                                    <Button type="submit" color="secondary" variant="contained" onClick={handleSubmitComment}
                                    disabled={content== "" ? true : false}  style={{ margin:"10px" }} 
                                    >
                                        Answer
                                    </Button>
                                </form>
                            }

                            {!isLoggedIn &&
                                <form className="post pb-4">
                                    <div className="form-row align-items-left mb-3 ml-3">
                                    <TextField
                                        style = {{minWidth:"40ch",maxWidth: "70ch"}}
                                        id="outlined-multiline-static"
                                        label="Comment.."
                                        multiline
                                        rows={5}
                                        defaultValue="Default Value"
                                        variant="outlined"
                                        placeholder="What are your thoughts? "
                                        value={content}
                                        onChange={onCommentChange}
                                        disabled={true}
                                        required />
                                    </div>
                                    <small className="form-text text-muted col-sm-11">
                                        Inappropriate or irrelevant answers will be filtered accordingly.
                                    </small>       
                                    <Alert severity="warning"  color="error">
                                        <AlertTitle>Warning</AlertTitle>
                                            <strong>Please </strong> 
                                            <strong>
                                            <NavLink className="underline-link alert-danger" to="/login">
                                            sign in</NavLink> to answer this question</strong> 
                                    </Alert>
                                </form>
                            }

                            {isLoggedIn && (username == user_post.username || isStaff === true) &&
                            <div>
                                <>
                                <Button  variant="contained" color="secondary"  style={{ width: 100, margin:"10px" }} 
                                startIcon={<Edit/>} onClick={() => {handleEditOpen();setPost(post.textContent,
                                post.title);}}>
                                        Edit
                                </Button>
                                <Dialog fullScreen={fullScreen} open={editOpen} onClose={handleEditClose}>
                                    <AppBar className={classes.appBar}>
                                        <Toolbar>
                                            <Button edge="start" color="inherit" onClick={handleEditClose} aria-label="close" startIcon={<CloseIcon />}/>
                                            <Typography variant="h4" className={classes.title}>
                                                Edit post
                                            </Typography>
                                        </Toolbar>
                                    </AppBar>
                                        <DialogContent>
                                        <form className="post pb-4" className={classes.form}>
                                            <div className="form-row align-items-left mb-3 ml-3">
                                                <div>
                                                <TextField
                                                    style = {{width: "60ch"}}
                                                    id="outlined-multiline-static"
                                                    defaultValue="Default Value"
                                                    variant="outlined"
                                                    placeholder="Title"
                                                    value={postTitleEdit}
                                                    onChange={onPostTitleEditChange}
                                                    disabled={!isLoggedIn}
                                                    required />
                                                </div>
                                                <div>
                                                <TextField
                                                    style = {{width: "60ch"}}
                                                    id="outlined-multiline-static"
                                                    defaultValue="Default Value"
                                                    variant="outlined"
                                                    placeholder="Title"
                                                    multiline
                                                    rows={4}
                                                    value={postEdit}
                                                    onChange={onPostEditChange}
                                                    disabled={!isLoggedIn}
                                                    required />
                                                </div>
                                            </div>
                                            <DialogActions>
                                                <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                    <Button variant = "outlined" 
                                                    className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                                                    onClick={handleEditPost}>
                                                        Save
                                                    </Button>
                                                    <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary"
                                                    onClick={handleEditClose}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </DialogActions>
                                        </form>
                                        </DialogContent>
                                    </Dialog> 
                                </>
                                <>                                  
                                    <Button  variant="contained" color="secondary"  style={{ width: 100 }} 
                                    startIcon={<Delete/>} onClick={() => handleDeleteOpen()}>
                                            Delete
                                    </Button>
                                    <Dialog
                                    open={deleteOpen}
                                    onClose={handleDeleteClose}
                                    fullScreen={fullScreen}
                                    aria-labelledby="simple-dialog-title"
                                    aria-describedby="simple-dialog-description"
                                    >
                                        <AppBar className={classes.appBar}>
                                            <Toolbar>
                                                <Button edge="start" color="inherit" onClick={handleDeleteClose} aria-label="close" startIcon={<CloseIcon />}/>
                                                <h4 id="simple-dialog-title">Delete post</h4>
                                            </Toolbar>
                                        </AppBar>
                                        <DialogContent>
                                            <DialogContentText>
                                                <div className="modal-body text-left pt-3 pb-3">
                                                    Are you sure you want to delete this post? 
                                                </div>
                                                <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                        <Button variant = "outlined" className="btn btn-default col-sm-5 btn-outline-danger mr-2"
                                                         style = {{margin:5}} onClick={handleDelete}>
                                                            Delete
                                                        </Button>
                                                        <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary" 
                                                        onClick={handleDeleteClose}>
                                                            Cancel
                                                        </Button>
                                                </div>
                                            </DialogContentText>
                                        </DialogContent>
                                    </Dialog> 
                                    </>
                                    </div>   
                            }     {/* end of delete post/question modal */}        
                        </li>
                    </ul>
            </CardContent>
        </Card>
        {/* Post */}
        <p className="whiteSpace"></p>

        {/*Comments*/}
            <div>
                <h2 className="pt-5 pb-2"> <b>Answers: </b></h2>
                < Linkify >
                
                    {comments && comments.map((comment) =>
                        <Card y={10}  className={classes.commentroot}>
                        <CardContent>
                        <div>
                            <div className="card mb-3 card-thread">
                                <div className="card-body mr-4 pb-0">
                                    <Typography variant="subtitle2">
                                        <div className="sub-text">
                                            Posted by {commentsUsers[comment.userID]}
                                            <div className="pl-0">
                                                Answered on {(comment.creationDate).split("T")[0]}
                                            </div>
                                        </div>
                                    </Typography>
                                    <Typography className={classes.pos} style={{marginBottom:12}}>
                                            <p className="whiteSpace">{comment.textContent}</p>
                                    </Typography>
                                        {isLoggedIn &&
                                        <div>
                                                 <Button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button"
                                                     data-toggle="modal" data-target="#commentsModal"
                                                     onClick={() => {
                                                        getReplies(`${comment.commentID}`); handleModalOpen('paper');}}
                                                     startIcon={<Comment/>}>
                                                         {comment.replyCount}
                                                 </Button>
                                                 
                                                <Dialog
                                                    open={modal}
                                                    fullScreen={fullScreen}
                                                    onClose={handleModalClose}
                                                    scroll={scroll}
                                                    style={{width:"100%"}}
                                                    aria-labelledby="scroll-dialog-title"
                                                    aria-describedby="scroll-dialog-description"
                                                    closeAfterTransition
                                                    BackdropComponent={Backdrop}
                                                    BackdropProps={{
                                                      timeout: 500,}}>
                                                        <AppBar className={classes.appBar}>
                                                            <Toolbar>
                                                                <Button edge="start" color="inherit" onClick={handleModalClose} aria-label="close" startIcon={<CloseIcon />}/>
                                                                <h4 id="simple-dialog-title">Replies</h4>
                                                            </Toolbar>
                                                        </AppBar>
                                                            <Fade in={modal} >
                                                                <DialogContent>
                                                                <div >
                                                                    <div id="scroll-dialog-title" className="modal fade" role="dialog">
                                                                        <div className="modal-dialog modal-lg">
                                                                            <div className="modal-content">
                                                                                <div className="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                                                                        <p className="font-italic pb-1 mb-0 pl-2">Commenting as {username}</p>
                                                                                </div>
                                                                                    <div className="modal-body text-left pt-0">
                                                                                        <div className="row content mb-0 greyBg pt-4 pb-3">
                                                                                <           form className="post pb-4">
                                                                                                <div className="form-row align-items-left mb-3 ml-3">
                                                                                                    <TextField
                                                                                                        style = {{ maxWidth: "100%"}}
                                                                                                        id="outlined-multiline-static"
                                                                                                        label="Reply"
                                                                                                        multiline
                                                                                                        rows={5}
                                                                                                        defaultValue="Default Value"
                                                                                                        variant="outlined"
                                                                                                        placeholder="Add reply... "
                                                                                                        value={replyContent}
                                                                                                        onChange={onReplyChange}
                                                                                                        required />
                                                                                                </div>
                                                                                                <small className="form-text text-muted col-sm-11">
                                                                                                    Inappropriate or irrelevant replies will be filtered accordingly.
                                                                                                </small>  
                                                                                                <br />
                                                                                                <Button type="submit" color="secondary" variant="contained" onClick={handleSubmitCommentAns}
                                                                                                disabled={replyContent == "" ? true : false} style={{marginBottom:15}}>
                                                                                                    Add Reply
                                                                                                </Button>
                                                                                            </form>
                                                                                        </div>
                                                                            
                                                                            {replies && replies.map((reply) => {
                                                                                const d = reply.creationDate;
                                                                                const e = d.split("T")[0];
                                                                                const id = reply.userID
                                                                                console.log(repliesUsers)
                                                                                console.log(repliesUsers[id])
                                                                                return (
                                                                                    isLoggedIn && (isStaff == true || id == reply.userID) ? (
                                                                                        <DialogContent dividers={scroll === 'paper'}>
                                                                                        <DialogContentText
                                                                                            id="scroll-dialog-description"
                                                                                            ref={descriptionElementRef}
                                                                                            tabIndex={-1}
                                                                                        >
                                                                                            <div>
                                                                                                <div className="row content">
                                                                                                    <div className="col-sm-12 ml-2">
                                                                                                        <p className="font-weight-bold pb-0 mb-0">
                                                                                                            Posted by {repliesUsers[id]}
                                                                                                            </p>
                                                                                                        <p className="sub-text pt-0 mt-0">
                                                                                                            Commented on {e} 
                                                                                                            </p>
                                                                                                            <p>{(id)}
                                                                                                            </p>
                                                                                                    </div>
                                                                                                    <p className="mr-3 ml-4 whiteSpace">{reply.textContent}</p>
                                                                                                    <Button className="btn btn-icon float-right"  title="Edit Answer" data-target="#deleteAnswerModal" 
                                                                                                        onClick={() =>{setReplyAndID(`${reply.replyID}`, 
                                                                                                        `${reply.textContent}`); handleEditRepOpen();setCommentID(reply.commentID)}} startIcon={<Edit/>}>
                                                                                                    </Button>
                                                                                                    <Dialog
                                                                                                        open={editRepOpen}
                                                                                                        fullScreen={fullScreen}
                                                                                                        onClose={handleEditRepClose}
                                                                                                        aria-labelledby="simple-dialog-title"
                                                                                                        aria-describedby="simple-dialog-description"
                                                                                                        >
                                                                                                        <AppBar className={classes.appBar}>
                                                                                                            <Toolbar>
                                                                                                                <Button edge="start" color="inherit" onClick={handleEditRepClose} aria-label="close" startIcon={<CloseIcon />}/>
                                                                                                                <h4 id="simple-dialog-title">Edit Reply</h4>
                                                                                                            </Toolbar>
                                                                                                        </AppBar>
                                                                                                            <DialogContent>
                                                                                                            <form className="post pb-4" className={classes.form}>
                                                                                                                <div className="form-row align-items-left mb-3 ml-3">
                                                                                                                    <div>
                                                                                                                    <TextField
                                                                                                                        id="outlined-multiline-static"
                                                                                                                        defaultValue="Default Value"
                                                                                                                        variant="outlined"
                                                                                                                        placeholder="Title"
                                                                                                                        value={replyEdit}
                                                                                                                        onChange={onReplyEditChange}
                                                                                                                        disabled={!isLoggedIn}
                                                                                                                        required />
                                                                                                                    </div> 
                                                                                                                </div>
                                                                                                                <DialogActions>
                                                                                                                    <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                                                                                        <Button variant = "outlined" 
                                                                                                                        className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                                                                                                                        onClick={handleEditReply}>
                                                                                                                            Save
                                                                                                                        </Button>
                                                                                                                        <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary"
                                                                                                                        onClick={handleEditRepClose}>
                                                                                                                            Cancel
                                                                                                                        </Button>
                                                                                                                    </div>
                                                                                                                </DialogActions>
                                                                                                            </form>
                                                                                                            </DialogContent>
                                                                                                        </Dialog> 
                                                                                                    <Button className="btn btn-icon float-right"  title="Delete Answer" data-target="#deleteAnswerModal" 
                                                                                                        onClick={() =>{setReplyID(`${reply.replyID}`); handleDeleteReplyOpen()}} startIcon={<Delete/>}>
                                                                                                    </Button>
                                                                                                    <Dialog
                                                                                                        open={deleteReplyOpen}
                                                                                                        fullScreen={fullScreen}
                                                                                                        onClose={handleDeleteReplyClose} 
                                                                                                        aria-labelledby="simple-dialog-title"
                                                                                                        aria-describedby="simple-dialog-description"
                                                                                                    >
                                                                                                    <AppBar className={classes.appBar}>
                                                                                                        <Toolbar>
                                                                                                            <Button edge="start" color="inherit" onClick={handleDeleteReplyClose}  aria-label="close" startIcon={<CloseIcon />}/>
                                                                                                            <h4 id="simple-dialog-title">Delete Reply</h4>
                                                                                                        </Toolbar>
                                                                                                    </AppBar>
                                                                                                    <DialogContent>
                                                                                                        <DialogContentText>
                                                                                                            <div className="modal-body text-left pt-3 pb-3">
                                                                                                                Are you sure you want to delete your reply? 
                                                                                                            </div>
                                                                                                            <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                                                                                <Button variant = "outlined" 
                                                                                                                className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                                                                                                                    onClick={handleDeleteReply}>
                                                                                                                    Delete
                                                                                                                </Button>
                                                                                                                <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary" 
                                                                                                                onClick={handleDeleteReplyClose}>
                                                                                                                    Cancel
                                                                                                                </Button>
                                                                                                            </div>
                                                                                        
                                                                                                        </DialogContentText>
                                                                                                    </DialogContent>
                                                                                                    </Dialog>
                                                                                                </div>   
                                                                                            </div>
                                                                                        </DialogContentText>
                                                                                    </DialogContent>
                                                                                    ) : (
                                                                                        <DialogContent dividers={scroll === 'paper'}>
                                                                                        <DialogContentText
                                                                                            id="scroll-dialog-description"
                                                                                            ref={descriptionElementRef}
                                                                                            tabIndex={-1}
                                                                                        >
                                                                                            <div>
                                                                                                <div className="row content">
                                                                                                    <div className="col-sm-12 ml-2">
                                                                                                        <p className="font-weight-bold pb-0 mb-0">@{repliesUsers[reply.userID]}</p>
                                                                                                        <p className="sub-text pt-0 mt-0">
                                                                                                            Commented on {e}
                                                                                                            </p>
                                                                                                    </div>
                                                                                                    <p className="mr-3 ml-4 whiteSpace">{reply.textContent}</p>
                                                                                                </div>   
                                                                                                
                                                                                            </div>
                                                                                        </DialogContentText>
                                                                                    </DialogContent>
                                                                                    )
                                                                                    )})}
                                                                     {replies.length == "0" &&
                                                                         <div className="muted-text mt-3 pl-3 pb-3">
                                                                             No Replies yet!
                                                                         </div>
                                                                     }
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     </div>
                                                </div>
                                                </DialogContent>
                                              </Fade>
                                              </Dialog>
                                    
                                              </div>
                                        }
                                         {!isLoggedIn &&
                                            <div>
                                                <Button className="btn btn-icon pl-3 pr-1 comment" title="View comments" type="button"
                                                     data-toggle="modal" data-target="#commentsModal"
                                                     onClick={() => {
                                                        getReplies(`${comment.commentID}`); handleModalOpen('paper');}}
                                                     startIcon={<Comment/>}>
                                                         {comment.replyCount}
                                                 </Button>
                                                    <Dialog
                                                    className={classes.modal}
                                                    open={modal}
                                                    fullScreen={fullScreen}
                                                    onClose={handleModalClose}
                                                    scroll={scroll}
                                                    aria-labelledby="scroll-dialog-title"
                                                    aria-describedby="scroll-dialog-description"
                                                    closeAfterTransition
                                                    BackdropComponent={Backdrop}
                                                    BackdropProps={{
                                                    timeout: 500,}}>
                                                        <AppBar className={classes.appBar}>
                                                            <Toolbar>
                                                                <Button edge="start" color="inherit" onClick={handleModalClose}  aria-label="close" startIcon={<CloseIcon />}/>
                                                                <h4 id="simple-dialog-title">Delete Reply</h4>
                                                            </Toolbar>
                                                        </AppBar>
                                                        <Fade in={modal}>
                                                            <div>
                                                                <div id="scroll-dialog-title" className="modal fade" role="dialog">
                                                                    <div className="modal-dialog modal-lg">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header blueBg">
                                                                                <h2 id="transition-modal-title">Replies</h2>
                                                                            </div>
                                                                            <div className="modal-body text-left pt-0">
                                                                            <div className="row content mb-0 greyBg pt-4 pb-3">
                                                                                <div className="col-xl-11 col-md-10 col-sm-10 col-xs-10">
                                                                                    <p className="font-italic pb-1 mb-0 pl-2">Commenting as {username}</p>
                                                                                    
                                                                                </div>
                                                                            </div>
                                                                            <hr className="mt-0 mb-4" />
                                                                            {replies && replies.map((reply) =>
                                                                                <DialogContent dividers={scroll === 'paper'}>
                                                                                    <DialogContentText
                                                                                    id="scroll-dialog-description"
                                                                                    ref={descriptionElementRef}
                                                                                    tabIndex={-1}
                                                                                    >
                                                                                    <div>
                                                                                        <div className="row content">
                                                                                            <div className="col-sm-12 ml-2">
                                                                                                <p className="font-weight-bold pb-0 mb-0">{repliesUsers[reply.userID]}</p>
                                                                                            </div>
                                                                                            <p className="mr-3 ml-4 whiteSpace">
                                                                                                {reply.textContent}
                                                                                            </p>
                                                                                        </div>     
                                                                                    </div>
                                                                                    </DialogContentText>
                                                                                </DialogContent>
                                                                            )}
                                                                            {replies.length == "0" &&
                                                                                <div className="muted-text mt-3 pl-3 pb-3">
                                                                                    No Replies yet!
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Fade>
                                                    </Dialog>
                                                    </div>
                                                }
                                        {/*Edit and Delete Comment*/}
                                        {isLoggedIn && id == `${comment.userID}` &&
                                        <ul>
                                            <>
                                                <Button className="btn btn-icon float-right" title="Edit Comment" data-toggle="modal" data-target="#editAnswerModal" 
                                                onClick={() => {setCommentAndID(`${comment.commentID}`, 
                                                `${comment.textContent}`);handleEditComOpen()}} startIcon={<Edit/>}>
                                                </Button>
                                                    <Dialog
                                                        open={editCommOpen}
                                                        fullScreen={fullScreen}
                                                        onClose={handleEditComClose}
                                                        className={classes.modal}
                                                        aria-labelledby="simple-dialog-title"
                                                        aria-describedby="simple-dialog-description"
                                                        >
                                                            <AppBar className={classes.appBar}>
                                                                <Toolbar>
                                                                    <Button edge="start" color="inherit" onClick={handleEditComClose}  aria-label="close" startIcon={<CloseIcon />}/>
                                                                    <h4 id="simple-dialog-title">Edit Comment</h4>
                                                                </Toolbar>
                                                            </AppBar>   
                                                            <DialogContent>
                                                            <form className="post pb-4" className={classes.form}>
                                                                <div className="form-row align-items-left mb-3 ml-3">
                                                                    <div>
                                                                    <TextField
                                                                        style = {{width: "60ch"}}
                                                                        id="outlined-multiline-static"
                                                                        defaultValue="Default Value"
                                                                        variant="outlined"
                                                                        placeholder="Title"
                                                                        value={commentEdit}
                                                                        onChange={onCommentEditChange}
                                                                        disabled={!isLoggedIn}
                                                                        required />
                                                                    </div>
                                                                </div>
                                                                <DialogActions>
                                                                    <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                                        <Button variant = "outlined" 
                                                                        className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                                                                        onClick={handleEditComment}>
                                                                            Save
                                                                        </Button>
                                                                        <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary"
                                                                        onClick={handleEditComClose}>
                                                                            Cancel
                                                                        </Button>
                                                                    </div>
                                                                </DialogActions>
                                                            </form>
                                                            </DialogContent>
                                                        </Dialog> 
                                                    </>
                                                <>
                                                <Button className="btn btn-icon float-right" type="button" data-toggle="modal" title="Delete Answer" data-target="#deleteAnswerModal" 
                                                onClick={() =>{setCommentID(`${comment.commentID}`); handleOpen()}} startIcon={<Delete/>}>
                                                </Button>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose} 
                                                    className={classes.modal}
                                                    fullScreen={fullScreen}
                                                    aria-labelledby="simple-dialog-title"
                                                    aria-describedby="simple-dialog-description"
                                                    >
                                                        <AppBar className={classes.appBar}>
                                                            <Toolbar>
                                                                <Button edge="start" color="inherit" onClick={handleClose}   aria-label="close" startIcon={<CloseIcon />}/>
                                                                <h4 id="simple-dialog-title">Delete Comment</h4>
                                                            </Toolbar>
                                                        </AppBar>                                                       
                                                        <DialogContent>
                                                            <DialogContentText>
                                                                <div className="modal-body text-left pt-3 pb-3">
                                                                    Are you sure you want to delete your comment? 
                                                                </div>
                                                                <div className="row content ml-1 mr-1 pt-5 d-flex justify-content-center">
                                                                    <Button variant = "outlined" 
                                                                    className="btn btn-default col-sm-5 btn-outline-danger mr-2" style = {{margin:5}}
                                                                        onClick={handleDeleteComment}>
                                                                        Delete
                                                                    </Button>
                                                                    <Button variant = "outlined" style = {{margin:5}} className="btn btn-default col-sm-5 btn-outline-secondary" 
                                                                    onClick={handleClose}>
                                                                        Cancel
                                                                    </Button>
                                                                </div>
                                            
                                                            </DialogContentText>
                                                        </DialogContent>
                                                    </Dialog>
                                                </>
                                            
                                        </ul>
                                        }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                    )}
                                        
                    {!comments || comments.length == "0" &&
                        <div className="card mb-3">
                            <div className="card-body mr-4">
                                <img                         
                                src={Void}
                                alt="Person reading a book"
                                className={classes.topimg}
                            />
                                <div className="muted-text mt-3">
                                    No answer yet for this question! Your contribution would be appreciated!
                                </div>
                            </div>
                        </div>
                    }
                </Linkify>
            </div>
        {/*END*/}

        </Container>
        </React.Fragment>
    );
                        }