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
        var url = "/loadreq";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
             this.storage = response;
             
             this.account = this.storage.accounts[this.userID];
             this.currentUser = this.account.username;
          
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
    async register() {
      if (this.usernameInput == "" || this.passwordInput == "" || this.emailInput == "" || this.dateInput == "") {
          return;
      }
      if (this.passwordInput != this.passwordInputConfirm) {
          this.message = "Passwords do not match.";
          return;
      }
      if (this.gendermale) {
          this.account.data.gender = "male";
      }
      else if (this.genderfemale) {
          this.account.data.gender = "female";
      }
      else {
          return;
      }
      
      this.account.username = this.usernameInput;
      this.account.data.password = this.passwordInput;
      this.account.data.email = this.emailInput;
      this.account.data.dob = this.dateInput;
      this.account.data.desc = "I am a new Blockmania user!";
      this.account.data.status = "Playin' games~";
      
      try {
        const response = await axios.get('https://jsonbin.org/earthboundness', {
          headers: { "authorization": "token e72374e4-a2cf-4d55-9c67-225e1b1317fe" }
        });
        
        this.storage = response.data;
        this.storage.accounts = Object.keys(response.data.accounts).map((key) => {
            return response.data.accounts[key];
        });
        
        this.userID = this.storage.accounts.length;
        this.otherUsername = this.account.username;
        this.storage.accounts.forEach(this.checkUsername);
        if (this.badRegister) {
            this.message = "That username is already in use.";
            return;
        }
        
        this.storage.accounts.push(this.account);
        
        this.message = "Registering...";
        axios({
          method: 'post',
          url: 'https://jsonbin.org/earthboundness',
          data: this.storage,
          headers: { "authorization": "token e72374e4-a2cf-4d55-9c67-225e1b1317fe" }
        });
        
        this.message = "Logging in...";
        document.cookie = "userID" + "=" + this.userID + ";path=/";
        this.usernameInput = "";
        this.passwordInput = "";
        this.emailInput = "";
        this.dateInput = "";
        this.gendermale = false;
        this.genderfemale = false;
        this.message = "Welcome, " + this.account.username + "!";
        this.currentUser = this.account.username;
        this.loggedIn = true;
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
        var url = "/loadreq";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
          this.storage = response;
          
          this.otherUsername = this.usernameInput;
          this.storage.accounts.forEach(this.checkUsername);
          if (this.foundID !== -1) {
            this.userID = this.foundID;
            this.foundID = -1;
          }
          else {
              this.message = "Incorrect username or password.";
              return;
          }
          
          if (!(this.strcmp(this.storage.accounts[this.userID].data.password,this.passwordInput))) {
              this.message = "Incorrect username or password.";
              return;
          }
          this.account = this.storage.accounts[this.userID];
          document.cookie = "userID" + "=" + this.userID + ";path=/";
          this.usernameInput = "";
          this.passwordInput = "";
          this.message = "Welcome, " + this.account.username + "!";
          this.currentUser = this.account.username;
          this.loggedIn = true;
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
        var url = "/loadreq";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
          this.storage = response;
          this.posts = this.storage.posts;
          
          this.max = this.storage.accounts.length - 1;
          this.viewingAccount = this.storage.accounts[id];
          
          this.status = this.viewingAccount.data.status;
          this.user = this.viewingAccount.username;
          this.desc = this.viewingAccount.data.desc;
          this.email = this.viewingAccount.data.email;
          this.dob = this.viewingAccount.data.dob;
          this.gender = this.viewingAccount.data.gender;
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
      this.status = this.statusInput;
      try {
        var url = "/loadreq";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
        
          this.storage = response;
          this.storage.accounts[this.userID].data.status = this.status;
        });
        
        /*axios({
          method: 'post',
          url: 'https://jsonbin.org/earthboundness',
          data: this.storage,
          headers: { "authorization": "token e72374e4-a2cf-4d55-9c67-225e1b1317fe" }
        });*/
      } catch (error) {
        console.log(error);
      }
      
      this.statusInput = "";
      this.showStatus = false;
    },
    updateDesc() {
      this.desc = this.descInput;
      try {
        var url = "/loadreq";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
        
          this.storage = response;
          this.storage.accounts[this.userID].data.desc = this.desc;
        });
  
        /*axios({
          method: 'post',
          url: 'https://jsonbin.org/earthboundness',
          data: this.storage,
          headers: { "authorization": "token e72374e4-a2cf-4d55-9c67-225e1b1317fe" }
        });*/
      } catch (error) {
        console.log(error);
      }
      
      this.descInput = "";
      this.showDesc = false;
    },
    searchUser() {
      this.otherUsername = this.userInput;
      this.storage.accounts.forEach(this.checkUsername);
      if (this.foundID !== -1) {
        this.otherUserID = this.foundID;
        this.foundID = -1;
        if (this.otherUserID !== this.userID) {
          this.ownProfile = false;
        }
        else {
          this.ownProfile = true;
        }
        this.loadProfile(this.otherUserID);
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
      try {
        var url = "/loadreq";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
        
          this.storage = response.data;
          this.posts = this.storage.posts;
          
          this.posts.push({
            title: this.addedTitle,
            author: this.account.username,
            date: moment().format("h:mm a MMM D YYYY"),
            post: this.addedPost,
            comments: []
          });
          this.addedTitle = "";
          this.addedPost = "";
          
          this.storage.posts = this.posts;
        });
  
        /*axios({
          method: 'post',
          url: 'https://jsonbin.org/earthboundness',
          data: this.storage,
          headers: { "authorization": "token e72374e4-a2cf-4d55-9c67-225e1b1317fe" }
        });*/
      } catch (error) {
        console.log(error);
      }
    },
    addComment() {
      try {
        var url = "/loadreq";
        $.getJSON(url,function(data) {
          return data;
        })
          .then((response) => {
        
          this.storage = response.data;
          this.posts = this.storage.posts;
          
          this.comments = this.posts[this.postID].comments;
          this.comments.push({
            author: this.account.username,
            date: moment().format("h:mm a MMM D YYYY"),
            text: this.addedComment
          });
          this.posts[this.postID].comments = this.comments;
          this.addedComment = "";
          
          this.storage.posts = this.posts;
        });
  
        /*axios({
          method: 'post',
          url: 'https://jsonbin.org/earthboundness',
          data: this.storage,
          headers: { "authorization": "token e72374e4-a2cf-4d55-9c67-225e1b1317fe" }
        });*/
      } catch (error) {
        console.log(error);
      }
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