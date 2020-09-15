import Web3 from "web3";
import smartArchiveArtifact from "../../build/contracts/SmartArchive.json";
import ipfs from './ipfs'

const App = {
  web3: null,
  account: null,
  meta: null,
  ipfsFileHash: "",
  records:[],
  buffer: null,

  start: async function() {
    const { web3 } = this;
    
    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = smartArchiveArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        smartArchiveArtifact.abi,
        deployedNetwork.address,
      );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      console.log("Account connected: " + this.account);
      const nalog = document.getElementById("nalog");
       nalog.innerHTML = "Account connected: " + this.account;
    } catch (error) {
      console.error("Could not connect to contract or chain.");
      this.setStatus("Could not connect to contract or chain.");
      nalog.innerHTML = "Could not connect to contract or chain."
    }
    this.showPregled();
  },

  addRecord: async function() {
    const referent = document.getElementById("referent").value;
    const predmet = document.getElementById("predmet").value;
    const datetime = new Date().getTime();
    const hashFile = this.ipfsFileHash;
    var hashJson = "";
    var count = this.records.length+1;
    const arch = [{
        'id': count,
        'meta': referent,
        'file_name': predmet,
        'link': hashFile,
        'timestamp': datetime,
        'sender': this.account
      }]

    ipfs.add(Buffer.from(JSON.stringify(arch)),(error, result) =>{
      if (error) {
        console.error(error);
        return;
      }

      hashJson = result[0].hash;
      this.sendToChain(hashJson,predmet);
      });
  },

  sendToChain: async function(hashJson,predmet){
    console.log("Hash passed to blockchain: " + hashJson);
    const { AddToArchive } = this.meta.methods;
    await AddToArchive(hashJson, predmet).send({ gas: 600000,from: this.account });
  },

  invalidateRecord: async function() {
    let id = document.getElementById("id__").innerHTML;
    id= id.substring(4); 
    console.log("Invalidating record: " + id);
    const { InvalidateRecord } = this.meta.methods;
    await InvalidateRecord(id).send({ gas: 6000000, from: this.account });
    this.setStatus("Archive invalidated!");
  },

  findRecordByReferent: async function(){
    const referent = document.getElementById("referentM").value;
    const { GetListLenght } = this.meta.methods;
    const mlist = await GetListLenght().call();

    for (var i = 0; i < mlist; i++) { 
      var id_ = "";
      var predmet_ = "";
      var fajl_ = "";
      var vreme_ = null;
      var referent_ = "";
      const hash_= this.records[i];

          ipfs.get( hash_, function (err, files) {
          files.forEach((file) => {
          var json = JSON.parse(file.content.toString('utf8'));
          referent_ = json[0].uploader;
          predmet_ = json[0].file_name;
          fajl_ = json[0].link;
          id_ = json[0].id;
          var date = new Date(json[0].timestamp);
          vreme_ = date.toDateString();
         
          if (referent_.includes(referent)){
            document.getElementById("rezultat").style.display = 'block';
            document.getElementById("id__").innerHTML = "ID: " + id_;
            document.getElementById("link").innerHTML = "Record link: https://ipfs.io/ipfs/" + hash_;
            document.getElementById("referentl").innerHTML = "Uploader: " + referent_;
            document.getElementById("predmetl").innerHTML = "File name: " + predmet_;
            document.getElementById("datum").innerHTML = "Date: " + vreme_;
            document.getElementById("fajl_").innerHTML = "Link: " + fajl_;          
            }  
            });       
          });
      } 
  },

  findRecordByPredmet: async function(){
    const predmet = document.getElementById("predmetM").value;
    const { GetListLenght } = this.meta.methods;
    const mlist = await GetListLenght().call();

    for (var i = 0; i < mlist; i++) { 
      var id_ = "";
      var predmet_ = "";
      var fajl_ = "";
      var vreme_ = null;
      var referent_ = "";
      const hash_= this.records[i];
  
        ipfs.get( hash_, function (err, files) {
          files.forEach((file) => {
          var json = JSON.parse(file.content.toString('utf8'));
          referent_ = json[0].uploader;
          predmet_ = json[0].file_name;
          fajl_ = json[0].link;
          id_ = json[0].id;
          var date = new Date(json[0].timestamp);
          vreme_ = date.toDateString();
 
          if (predmet_.includes(predmet)){
            document.getElementById("rezultat").style.display = 'block';
            document.getElementById("id__").innerHTML = "ID: " + id_;
            document.getElementById("link").innerHTML = "Record link: https://ipfs.io/ipfs/" + hash_;
            document.getElementById("referentl").innerHTML = "Uploader: " + referent_;
            document.getElementById("predmetl").innerHTML = "File name: " + predmet_;
            document.getElementById("datum").innerHTML = "Date: " + vreme_;
            document.getElementById("fajl_").innerHTML = "Link: " + fajl_;        
          } 
            });
          });
      } 
  },

  findRecordByID: async function(){
    console.log(this.records);
    const id = document.getElementById("ids").value;
    const { GetListLenght } = this.meta.methods;
    const mlist = await GetListLenght().call();

    for (var i = 0; i < mlist; i++) { 

      var id_ = "";
      var predmet_ = "";
      var fajl_ = "";
      var vreme_ = null;
      var referent_ = "";
      const hash_= this.records[i];

        ipfs.get( hash_, function (err, files) {
          files.forEach((file) => {
          var json = JSON.parse(file.content.toString('utf8'));
          referent_ = json[0].uploader;
          predmet_ = json[0].file_name;
          fajl_ = json[0].link;
          id_ = json[0].id;
          
          var date = new Date(json[0].timestamp);
          vreme_ = date.toDateString();
        //  console.log("File content >> ", id_,hash_, referent_,predmet_,fajl_,vreme_); 
          if (id_ == id){
            document.getElementById("rezultat").style.display = 'block';
            document.getElementById("id__").innerHTML = "ID: " + id_;
            document.getElementById("link").innerHTML = "Record link: https://ipfs.io/ipfs/" + hash_;
            document.getElementById("referentl").innerHTML = "Uploader: " + referent_;
            document.getElementById("predmetl").innerHTML = "File name: " + predmet_;
            document.getElementById("datum").innerHTML = "Date: " + vreme_;
            document.getElementById("fajl_").innerHTML = "Link: " + fajl_;    
          } 
        });
      }); 
    } 
  },

  sort: async function() {
    const { GetListLenght } = this.meta.methods;
    const mlist = await GetListLenght().call();
    this.setStatus("Total records: " + mlist);
    this.getListOfRecords();
  },

  getListOfRecords: async function(){
    const { GetList} = this.meta.methods;
    const mlist = await GetList().call();
    document.getElementById('recordList').innerHTML="";
    var temp = new Array();
    temp = mlist.split(" ");
    temp.splice(0, 1);
    var newtemp = new Array();
    for (var i = 0; i < temp.length; i++) { 
      newtemp = temp[i].split(",");
      document.getElementById('recordList').innerHTML += '<li>' + (i) + '. ' + newtemp[1] + ': <a href="https://ipfs.io/ipfs/' + newtemp[0] + '" target="blank">' + newtemp[0] + '</a> ' + '</li>';
    } 
    newtemp.splice(1, 1);
    this.records=newtemp;
    
  },

  captureFile: async function(evt) {
    this.buffer = null;
    this.ipfsFileHash = "";
    const files_ = evt.files;
    const file = files_[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.buffer = Buffer(reader.result);
      console.log('buffer', this.buffer);
      ipfs.add(this.buffer, (error, result) => {
        if (error) {
          console.error(error);
          return;
        }
        this.setStatus("File uploaded, ready to save..")
        return this.ipfsFileHash=result[0].hash;
      });
    };
  },

  setStatus: function(message_) {
    const status = document.getElementById("status");
    status.innerHTML = message_;
  },

  showStart: function(){
    document.getElementById("unos").style.display = 'none';
    document.getElementById("pregled").style.display = 'none';
    document.getElementById("settings").style.display = 'none';
    document.getElementById("nadji").style.display = 'none';
  },

  showUnos: function(){
    document.getElementById("unos").style.display = 'block';
    document.getElementById("pregled").style.display = 'none';
    document.getElementById("settings").style.display = 'none';
    document.getElementById("nadji").style.display = 'none';
    document.getElementById("referent").value = '';
    document.getElementById("predmet").value = '';
    document.getElementById("fajl").value = '';
    this.setStatus("");
  },

  showPregled: function(){
    document.getElementById("unos").style.display = 'none';
    document.getElementById("pregled").style.display = 'block';
    document.getElementById("settings").style.display = 'none';
    document.getElementById("nadji").style.display = 'none';
    this.sort();
  },

  showNadji: function(){
    document.getElementById("unos").style.display = 'none';
    document.getElementById("pregled").style.display = 'none';
    document.getElementById("settings").style.display = 'none';
    document.getElementById("nadji").style.display = 'block';
    document.getElementById("referentM").value = '';
    document.getElementById("predmetM").value = '';
    document.getElementById("ids").value = '';
    document.getElementById("rezultat").style.display = 'none';
    this.setStatus("");
  },

  showSettings: function(){
    document.getElementById("unos").style.display = 'none';
    document.getElementById("pregled").style.display = 'none';
    document.getElementById("settings").style.display = 'block';
    document.getElementById("nadji").style.display = 'none';
    this.setStatus("");
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn( 
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
