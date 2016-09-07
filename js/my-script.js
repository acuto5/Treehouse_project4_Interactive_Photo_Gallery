$(document).ready(function(){

	var currentImgIndex;
	var searchImgList = [];	//Images or video index list shown as user type in search input
	var $body = $("body");
	var $overlay = $("<div id='overlay'></div>");
	var $img = $("<img class='overlayImg'>" + "<iframe id='player' src='' frameborder='0' allowfullscreen=''></iframe>");
	var $caption = $("<p></p>");
	var $leftArrow = $("<img src='img/left.png' class='left'>");
	var $rightArrow = $("<img src='img/right.png' class='right'>");
	var $close = $("<img src='img/x.png' class='x'>");
	var $noResultDiv = $("<div id='noResult'><h1>Sorry, no results were found. Try search again..</h1></div>");
	$overlay.append($leftArrow, $img, $rightArrow, $close, $caption);
	$body.append($overlay, $noResultDiv);

    $("#imgGallery a").click(function(e){
		e.preventDefault();
		var imgVideoSrc = $(this).attr("href");
		var captionText = $(this).children().attr("alt");
		$caption.text(captionText);
		if($(this).hasClass("video")){
			showHideOverlayImgVideo("video", imgVideoSrc);
		}else{
			showHideOverlayImgVideo("", imgVideoSrc);
		}
		currentImgIndex = $("#imgGallery a").index(this);
		$overlay.slideDown();
    });
	
	$(document).on("click", ".left", function(){ showNextPreviousImgVideo("previous"); });
	$(document).on("click", ".right", function(){ showNextPreviousImgVideo("next"); });
	$(document).on("click", "#overlay img.x", function(){ $("#player").attr('src', ''); $("#overlay").slideUp(); });
	$(document).keyup(function(e){
		if (e.keyCode == 37) { 
		   showNextPreviousImgVideo("previous");
		   return false;
		}
		if (e.keyCode == 39) { 
		   showNextPreviousImgVideo("next");
		   return false;
		}
		if (e.which == 27){
			$("#player").attr('src', '');
			$("#overlay").slideUp();
			return false;
		}
	});
	
	$("#search").keyup(function(){
		searchImgList = [];
		var userText = $("input").val().toLowerCase();
		$("#imgGallery a").each(function(){
			var $attr = $(this).children().attr("alt").toLowerCase();
			if($attr.indexOf(userText) > -1){
				$(this).parent().fadeIn(300);
				searchImgList.push($("#imgGallery a").index(this));
			}else{
				$(this).parent().fadeOut(300);
			}
		});
		if(searchImgList.length === 0){
			$noResultDiv.show();
		}else{
			$noResultDiv.hide();
		}
	});
	
	
	//show next or previous image or video
	function showNextPreviousImgVideo(direction){
		$('.overlayImg').hide();
		$('#player').hide();
		var imgVideoTotal = $("#imgGallery a").length - 1;
		var nextImgVideoIndex;
		var imgSrc;
		var videoHref;
		var currentImgIndexGlobal;
		var searchImgListGlobal;
		var caption;
		currentImgIndexGlobal = getCurrentImgIndex();
		searchImgListGlobal = getSearchImgList();
		nextImgVideoIndex = nextPrevImgVideoInd(searchImgListGlobal, direction, currentImgIndexGlobal, imgVideoTotal);
		videoHref = $("li a").eq(nextImgVideoIndex).attr('href');
		imgSrc = $("li img").eq(nextImgVideoIndex).attr('src').replace('/thumbnail', '');
		caption = $("li img").eq(nextImgVideoIndex).attr('alt');
		$('#overlay p').text(caption);
		$("#player").attr('src', '');
		if($("#imgGallery a").eq(nextImgVideoIndex).hasClass("video")){
			showHideOverlayImgVideo("video", videoHref);
		}else{
			showHideOverlayImgVideo("", imgSrc);
		}
	}
	
	//return next or previous image or video index
	function nextPrevImgVideoInd(arr, direction, index, imgVideoTotal){
		if(arr.length > 0){
			for(var i = 0; i < arr.length; i += 1){
				if(index === arr[i]){
					if(direction === "previous"){
						if(i === 0){
							index = arr[arr.length - 1];
							break;
						}else{
							index = arr[i - 1];
							break;
						}
					}else if(direction === "next"){
						if(i === arr.length - 1){
							index = arr[0];
							break;
						}else{
							index = arr[i + 1];
							break;
						}
					}
				}
			}
		}else{
			if(direction === "previous"){
				if(index > 0){
					index -= 1;
				}else{
					index = imgVideoTotal;
				}
			}else if(direction === "next"){
				if(index < imgVideoTotal){
					index += 1;
				}else{
					index = 0;
				}
			}
		}
		setCurrentImgIndex(index);
		return index;
	}
	
	//show or hide image or video in overlay layout if user click on an image or video
	function showHideOverlayImgVideo(imgClass, imgSrc){
		if(imgClass === "video"){
			$(".overlayImg").hide();
			$("#player").show();	
			$("#player").attr("src", imgSrc);
			$("p").css("text-align", "center");
		}else{
			$("#player").hide();	
			$(".overlayImg").fadeIn(300);
			$(".overlayImg").attr("src", imgSrc);
			$("p").css("text-align", "left");
		}
	}
	
	function getSearchImgList(){
		return searchImgList;
	}	
	
	function setCurrentImgIndex(newCurrentImgIndex){
		currentImgIndex = newCurrentImgIndex;
	}
	
	function getCurrentImgIndex(){
		return currentImgIndex;
	}
});

