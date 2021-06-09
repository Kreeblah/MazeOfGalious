// zoomimage
function zoom(img) 
{
	// position our zoom image 100px from the 'top'
	var zoomobj = (document.all) ? document.all.zoom : document.getElementById('zoom');
	var body = (document.compatMode && document.compatMode != 'BackCompat') ? document.documentElement : document.body;
	var dsoctop = (document.all) ? body.scrollTop : pageYOffset;
	zoomobj.style.top = (dsoctop + 75) + 'px';
	
	// display zoomed image
	document.getElementById('zoom').style.display = 'block';
	document.getElementById('closeup').src = img;
}

function unzoom(obj)
{
	document.getElementById(obj).style.display = 'none';
	document.getElementById('closeup').src = 'pics/1pixel.gif';
}

// hide or show an element on our page
var prev = 'home';
function show(obj) 
{
	// hide our previous div
	if (prev != obj && document.getElementById(prev)) {
		document.getElementById(prev).style.display = 'none';
		document.getElementById('nav' + prev).className = '';
	}

	// swap
	if (prev == obj) {
		prev = 0;
	} else if (document.getElementById(obj)) {
		document.getElementById(obj).style.display = 'block';
		document.getElementById('nav' + obj).className = 'selected';
		prev = obj;
	}
}
