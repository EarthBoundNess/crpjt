let app = new Vue({
  el: '#app',
  data: {
    account: {data: {} },
    storage: {accounts: [], posts: []},
    usernameInput: "",
    passwordInput: "",
    passwordInputConfirm: "",
    emailInput: "",
    dateInput: "",
    gendermale: false,
    genderfemale: false,
    message: "",
    badRegister: false,
    foundID: -1,
    currentUser: "",
    userID: -1,
    loggedIn: false,
    otherUserID: -1,
    otherUsername: "",
    max: 0,
    viewingAccount: null,
    status: "",
    user: "",
    desc: "",
    email: "",
    dob: "",
    gender: "",
    ownProfile: false,
    showStatus: false,
    showDesc: false,
    statusInput: "",
    descInput: "",
    userInput: "",
    posts: [],
    postID: -1,
    showList: true,
    addedTitle: "",
    addedPost: "",
    title: "",
    post: "",
    author: "",
    date: "",
    comments: [],
    addedComment: ""
  },
  created() {
    this.loadPage();
  },
  methods: {
    loadPage() {
      this.loadForum();
      var cookie = this.getCookie("userID");
      if (cookie != "" && Number(cookie) !== -1) {
        this.userID = Number(cookie);
        this.loggedIn = true;
      }
      else {
        this.ownProfile = false;
        this.otherUserID = 0;
        this.loadProfile(0);
        return;
      }
      try {
        this.currentUser = "Loading...";
        var url = "/users/getusername?q="+this.userID;
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
             this.currentUser = response.username;
          
             if (this.otherUserID !== -1) {
                this.ownProfile = false;
                this.loadProfile(this.otherUserID);
             }
             else {
                this.ownProfile = true;
                this.otherUserID = this.userID;
                this.loadProfile(this.userID);
             }
        });
      } catch (error) {
        console.log(error);
      }
    },
    register() {
      if (this.usernameInput == "" || this.passwordInput == "" || this.emailInput == "" || this.dateInput == "") {
          this.message = "Please fill all fields.";
          return;
      }
      if (this.passwordInput != this.passwordInputConfirm) {
          this.message = "Passwords do not match.";
          return;
      }
      if (this.gendermale) {
          this.gender = "male";
      }
      else if (this.genderfemale) {
          this.gender = "female";
      }
      else {
          this.message = "Please fill all fields.";
          return;
      }
      
      var body = {
        "username":this.usernameInput,
        "password": this.passwordInput,
        "email":this.emailInput,
        "dob":this.dateInput,
        "gender": this.gender
      };
      
      try {
        this.message = "Registering...";
        var url = "/users";
        $.post(url,body,function(data) {
          return data;
        })
          .then((response) => {
            if (response !== null) {
              this.message = "Logging in...";
              this.userID = response.id;
              this.currentUser = this.usernameInput;
              
              document.cookie = "userID" + "=" + this.userID + ";path=/";
              this.usernameInput = "";
              this.passwordInput = "";
              this.emailInput = "";
              this.dateInput = "";
              this.gendermale = false;
              this.genderfemale = false;
              this.message = "Welcome, " + this.currentUser + "!";
              this.loggedIn = true;
            }
            else {
              this.message = "That username is already in use.";
            }
        });
      } catch (error) {
        console.log(error);
      }
    },
    login() {
      if (this.usernameInput == "" || this.passwordInput == "") {
          return;
      }
      try {
        this.message = "Logging in...";
        var url = "/users/login";
        $.post(url,{"username":this.usernameInput,"password":this.passwordInput},function(data) {
          return data;
        })
          .then((response) => {
            if (response !== null) {
              this.userID = response.id;
              this.currentUser = this.usernameInput;
              
              document.cookie = "userID" + "=" + this.userID + ";path=/";
              this.usernameInput = "";
              this.passwordInput = "";
              this.message = "Welcome, " + this.currentUser + "!";
              this.loggedIn = true;
            }
            else {
              this.message = "Incorrect username or password.";
            }
        });
      } catch (error) {
        console.log(error);
      }
    },
    loadForum() {
      try {
        var url = "/thread";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
             this.posts = response;
        });
      } catch (error) {
        console.log(error);
      }
    },
    loadProfile(id) {
      try {
        this.status = "Loading...";
        this.user = "";
        this.desc = "";
        var url = "/users/getuser?q="+this.userID+","+id;
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
          this.max = response.max;
          
          this.status = response.status;
          this.user = response.username;
          this.desc = response.desc;
          if (response.email !== null) {
            this.email = response.email;
            this.dob = response.dob;
            this.gender = response.gender;
          }
          
          /*$.post("/users",{
            username: response.username,
            password: response.password,
            gender: response.gender,
            email: response.email,
            dob: response.dob
          },function(data) {
              return data;
          })*/
        });
      } catch (error) {
        console.log(error);
      }
    },
    strcmp(str1,str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    return (((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1)) == 0);
    },
    checkUsername(x,i) {
        if (this.strcmp(this.otherUsername,x.username)) {
            this.badRegister = true;
            this.foundID = i;
            return;
        }
    },
    openUpdateStatus() {
      this.showStatus = true;
    },
    openUpdateDesc() {
      this.showDesc = true;
    },
    updateStatus() {
      var body = {
        "id": this.userID,
        "status": this.statusInput
      };
      
      try {
        var url = "/users/statusreq";
        $.post(url,body,function(data) {
          return data;
        })
          .then((response) => {
            if (response) {
              this.status = this.statusInput;
              this.statusInput = "";
              this.showStatus = false;
            }
        });
      } catch (error) {
        console.log(error);
      }
    },
    updateDesc() {
      var body = {
        "id": this.userID,
        "desc": this.descInput
      };
      
      try {
        var url = "/users/descreq";
        $.post(url,body,function(data) {
          return data;
        })
          .then((response) => {
            if (response) {
              this.desc = this.descInput;
              this.descInput = "";
              this.showDesc = false;
            }
        });
      } catch (error) {
        console.log(error);
      }
    },
    searchUser() {
      try {
        var url = "/users/getid?q="+this.userInput;
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
            if (response !== null) {
              this.otherUserID = response.id;
              this.loadProfile(response.id);
            }
        });
      } catch (error) {
        console.log(error);
      }
    },
    prevUser() {
      if (this.otherUserID > 0) {
        this.otherUserID -= 1;
        if (this.otherUserID !== this.userID) {
          this.ownProfile = false;
        }
        else {
          this.ownProfile = true;
        }
        this.loadProfile(this.otherUserID);
      }
    },
    nextUser() {
      if (this.otherUserID < this.max) {
        this.otherUserID += 1;
        if (this.otherUserID !== this.userID) {
          this.ownProfile = false;
        }
        else {
          this.ownProfile = true;
        }
        this.loadProfile(this.otherUserID);
      }
    },
    ownUser() {
      if (this.otherUserID !== this.userID) {
        this.otherUserID = this.userID;
        this.ownProfile = true;
        this.loadProfile(this.otherUserID);
      }
    },
    logout() {
      this.userID = -1;
      this.loggedIn = false;
      this.ownProfile = false;
      
      document.cookie = "userID" + "=" + this.userID + ";path=/";
      
      /*try {
        var url = "/users";
        $.delete(url,function(data) {
          return data;
        })
      } catch (error) {
        console.log(error);
      }*/
    },
    openPost(post, index) {
      this.showList = false;
      this.title = post.title;
      this.post = post.post;
      this.author = post.author;
      this.date = post.date;
      this.comments = post.comments;
      this.postID = index;
    },
    backToList() {
      this.showList = true;
    },
    addPost() {
      this.loadForum();
      
      this.posts.push({
        title: this.addedTitle,
        author: this.currentUser,
        date: moment().format("h:mm a MMM D YYYY"),
        post: this.addedPost,
        comments: []
      });
      
      var body = {"posts":JSON.stringify(this.posts)};
      
      try {
        var url = "/postreq";
        $.post(url,body,function(data) {
          return data;
        })
          .then((response) => {
            if (response) {
              this.addedTitle = "";
              this.addedPost = "";
            }
        });
      } catch (error) {
        console.log(error);
      }
      
      this.loadForum();
    },
    addComment() {
      this.loadForum();
      
      this.comments = this.posts[this.postID].comments;
      this.comments.push({
        author: this.currentUser,
        date: moment().format("h:mm a MMM D YYYY"),
        text: this.addedComment
      });
      this.posts[this.postID].comments = this.comments;
      
      var body = {"posts":JSON.stringify(this.posts)};
      
      try {
        var url = "/postreq";
        $.post(url,body,function(data) {
          return data;
        })
          .then((response) => {
            if (response) {
              this.addedComment = "";
            }
        });
      } catch (error) {
        console.log(error);
      }
      
      this.loadForum();
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  }
});