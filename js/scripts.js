
try{
var db=firebase.database().ref('liveclass');
var isStudent;
var isOkay=false;

firebase.auth().onAuthStateChanged(function(user){
	if(!user){
		d('btn_sign').className='fa fa-sign-in btn-sign';
		isStudent=true;
		d('info').innerHTML='Student Mode';
		d('editor').style.display='';
		d('my_editor').style.display='none';
	}else{
		d('btn_sign').className='fa fa-sign-out btn-sign';
		isStudent=false;
		d('editor').style.display='none';
		d('my_editor').style.display='';
		d('info').innerHTML='Teacher Mode';
	}
});
d('my_editor').addEventListener('keyup',function(){
    db.child('code').set(d('my_editor').innerText);
	update();
});
d('btn_sign').addEventListener('click',function(){
	if(isStudent){
		showAuth();
	}else{
		if(confirm('Are you sure to sign-out ?')){
		 if(firebase.auth().currentUser){
			 showLoad();
			firebase.auth().signOut().then(function(){
				closeLoad();
				window.location.reload();
			}).catch(function(error){
				closeLoad();
				alert(error);
			});
		  }
		}
	}
});

db.child('code').on('value',function(snap){
	if(isOkay && isStudent){ 
	  editor.setValue(String(snap.val()),1);
	  update();
    }
});

}catch(e){
	alert(e);
}

function ready(){
	try{
	navigator.wakeLock.request("screen");
	setupEditor();
	update();
	}catch(e){
		alert(e);
	}
}
function update(){
	var idoc=d('iframe').contentWindow.document;
	idoc.open();
	//idoc.write();
	   db.child('code').once('value',function(snap){
		  idoc.write(snap.val());
	  });
	idoc.close();
}
function setupEditor(){
	window.editor=ace.edit("editor");
	//editor.setTheme("ace/theme/dreamweaver");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/html");
	isOkay=true;
	if(!isStudent){
		db.child('code').once('value',function(snap){
		//editor.setValue(String(snap.val()),1);
		d('my_editor').innerText=snap.val();
	});
	}
	editor.focus();
	editor.setOptions({
		fontFamily:"Monaco",
		fontSize:"10pt",
		showLineNumbers:true,
		showGutter:false,
		vScrollBarAlwaysVisible:true,
		enableBasicAutoCompletion:true,
		enableLiveAutoCompletion:true
	});
	editor.setShowPrintMargin(true);
	editor.setBehavioursEnabled(true);
}
function showLoad(){
	d('pan_load').style.display='flex';
}
function closeLoad(){
	d('pan_load').style.display='none';
}
function showAuth(){
	d('pan_auth').style.display='flex';
	d('myform').addEventListener('submit',function(e){
		e.preventDefault();
		closeAuth();
		showLoad();
		firebase.auth().signInWithEmailAndPassword(d('mail').value,d('pass').value).then(function(){
			closeLoad();
			window.location.reload();
		}).catch(function(error){
			closeLoad();
			alert(error);
		});
	});
}
function closeAuth(){
	d('pan_auth').style.display='none';
}
function addLineClass (pre) {
		var lines = pre.innerText.split("\n"); // can use innerHTML also
		while(pre.childNodes.length > 0) {
			pre.removeChild(pre.childNodes[0]);
		}
		for(var i = 0; i < lines.length; i++) {
			var span = document.createElement("span");
			span.className = "line";
			span.innerText = lines[i]; // can use innerHTML also
			pre.appendChild(span);
			pre.appendChild(document.createTextNode("\n"));
		}
	}
	window.addEventListener("load", function () {
		var pres = document.getElementsByTagName("pre");
		for (var i = 0; i < pres.length; i++) {
			addLineClass(pres[i]);
		}
	}, false);
function d(id){
	return document.getElementById(id);
}
