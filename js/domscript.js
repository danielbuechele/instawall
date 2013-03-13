var api = "https://api.instagram.com/v1/tags/#hashtag/media/recent?access_token=280712.f59def8.a33f9d700568474283fa7a22020ce1f7&callback=?";
var hashtag = "";
var latest = "";
var reloadTime = 3000;
var timer;


	
var needsReload = function () {
	$("#search input").focus();
	url = api.replace("#hashtag",hashtag);
	$.getJSON(url, function(data) {
		if (data.data[0].images.standard_resolution.url!=latest) {
			console.log("reload");
			showImage(data.data[0].images.standard_resolution.url);

		} else {
			console.log("no update needed");	
		}
		
		timer = setTimeout(needsReload,reloadTime);

	});
}
	
	
$(function(){

	
	$("#search input").focus();
	
	
	$(".pic").click(function () {
		hideSearch();
	});
	
	$(document).keypress(function(e) {
		$("#search input").focus();
		$("#search").fadeIn();
	});
	
	
	if (location.hash) {
		console.log(location.hash.substring(1));
		setHashtag(location.hash.substring(1));
	}
	
	
	$(window).bind( 'hashchange', function(e) {
		console.log(location.hash.substring(1));
		setHashtag(location.hash.substring(1));
	});

})

function setHashtag(newHashtag) {
	if (!newHashtag) {
		hashtag = $("#search input").val();
		$.bbq.pushState("#"+hashtag);
	} else {
		hashtag = newHashtag;	
	}
	
	console.log(hashtag);
	
	clearTimeout(timer);
	hideSearch();
	
	url = api.replace("#hashtag",hashtag);
	$.getJSON(url, function(data) {
		console.log("load");
		showImage(data.data[0].images.standard_resolution.url);
		needsReload();
	});
	
	return false;
}

function hideSearch () {
	$("#search").fadeOut(100, function () {
		$("#search input").val("");
		$("#search input").focus();
	});	
}

function showImage(url) {
	if (url.length==0) return;
	console.log("showImage")
	latest = url;
	$.loadImages(url,function () {
		$(".passive").css("background-image","url("+url+")");
		$(".passive").fadeIn(500,function () {
			$(".pic:not(.passive)").fadeOut(500,function () {
				$(".passive").removeClass("passive");
				$(this).addClass("passive");
			});
		});
		

	});
}