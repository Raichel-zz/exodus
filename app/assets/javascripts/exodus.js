var colW = 200, rowH = 200;
var columns = null;

$(document).ready(function() {
	// Check if user is logged in
	if (window.current_user) {
		$("#welcomeGreeting").text(window.current_user.email);
		$(".onlyForLoggedOutUser").css("display", "none");
		$(".onlyForLoggedInUser").css("display", "inline");
	} else {
		$(".onlyForLoggedOutUser").css("display", "inline");
		$(".onlyForLoggedInUser").css("display", "none");
	}
	$(window).resize(renderScreen).resize(); // trigger resize to position
	// screen containers

	if (window.current_user) {
		showWizard(true);
	}
});

function showScreenBlanket() {
	if ($(".screen-blanket").length == 0) {
		$(document.body).append($("<div class='screen-blanket'></div>"));
	}
	$(".screen-blanket").css({
		width : $(window).width(),
		height : $(window).height(),
		display : "inline"
	});
	$(".screen-blanket").click(hideScreenBlanket);
}

function hideScreenBlanket() {
	if ($(".screen-blanket")) {
		$(".screen-blanket").remove();
	}
}

function logout() {
	// submit as ajax
	$.ajax({
		url : "/users/logout.json?authenticity_token="
				+ encodeURIComponent(window._token),
		format : 'json',
		type : "delete",
		success : function(data) {
			/*
			 * window._token = data.auth_token;
			 * $(".onlyForLoggedOutUser").css("display", "inline");
			 * $(".onlyForLoggedInUser").css("display", "none");
			 */
		},
		complete : function() {
			// Put your error code here
			$(location).attr("href", $(location).attr('href'));
		}
	});
}

function showLogin() {
	// Remove any blanket that may be visible
	hideScreenBlanket();
	showScreenBlanket();
	$(".screen-blanket").append($(".loginDivContainer").html());
	$(".loginDiv").click(function(event) {
		event.stopPropagation();
	});
	$(".loginDiv").css(
			{
				left : ($(".screen-blanket").outerWidth() / 2)
						- ($(".loginDiv").outerWidth() / 2),
				top : ($(".screen-blanket").outerHeight() / 2)
						- ($(".loginDiv").outerHeight() / 2)
			});
}

function login() {
	// submit as ajax
	$
			.ajax({
				url : "/users/login.json?html[id]=sign_in_user&remote=true&authenticity_token="
						+ encodeURIComponent(window._token),
				data : $(".screen-blanket #login_user").serialize(),
				format : 'json',
				type : "post",
				success : function(data) {
					$(".loginValidationErrorsDiv").empty();
					if (data.success) {
						setCurrentUser(data.user);
						window._token = data.auth_token;
						hideScreenBlanket();
					} else {
						$(".loginValidationErrorsDiv").append(
										"<p>" + data.errors[0] + "<p>");
					}
				},
				error : function() {
					// Put your error code here
				}
			});
}

function showSignup() {
	// Remove any blanket that may be visible
	hideScreenBlanket();
	showScreenBlanket();
	$(".screen-blanket").append($(".signupDivContainer").html());
	$(".signupDiv").click(function(event) {
		event.stopPropagation();
	});
	$(".signupDiv").css(
			{
				left : ($(".screen-blanket").outerWidth() / 2)
						- ($(".signupDiv").outerWidth() / 2),
				top : ($(".screen-blanket").outerHeight() / 2)
						- ($(".signupDiv").outerHeight() / 2)
			});
}

function signup() {
	// submit as ajax
	$
			.ajax({
				url : "/users.json?html[id]=sign_up_user&remote=true&authenticity_token="
						+ encodeURIComponent(window._token),
				data : $(".screen-blanket #signup_user").serialize(),
				format : 'json',
				type : "post",
				success : function(data) {
					$(".signupValidationErrorsDiv").empty();
					if (data.success) {
						setCurrentUser(data.user);
						hideScreenBlanket();
					} else {
						for (var name in data.errors) {
							if (data.errors.hasOwnProperty(name)) {
								$(".signupValidationErrorsDiv").append(
										"<p>" + data.errors[name] + "<p>");
							}
						}
					}
				},
				error : function() {
					// Put your error code here
				}
			});
}

function setCurrentUser(user) {
	window.current_user = user;
	$(".onlyForLoggedOutUser").css("display", "none");
	$(".onlyForLoggedInUser").css("display", "inline");
	$("#welcomeGreeting").text(window.current_user.email);
}

function renderScreen() {
	// Main container height
	// $(".main-container").css("height", $window.height());

	// Prevent the user from saving our images and edited canvas
	$('body').on('contextmenu', 'canvas', function(e) {
		return false;
	});
	$('body').on('contextmenu', 'img', function(e) {
		return false;
	});
	// Set the background div size to cover the window
	var $window = $(window);
	$('#backgroundDiv').width($window.outerWidth());
	$('#backgroundDiv').height($window.outerHeight());

	// check if columns has changed
	var currentColumns = Math
			.floor(($('#wizardContainer').width() - 10) / colW);
	if (currentColumns !== columns) {
		// set new column count
		columns = currentColumns;
		// apply width to container manually,
		// then trigger relayout
		$('#themesTileContainer').width(columns * colW);
	}
	// resize the blanket if there is one visible
	if ($(".screen-blanket").length > 0) {
		$(".screen-blanket").css({
			width : $(window).width(),
			height : $(window).height()
		});
	}
}

function filterThemes() {
	var filter = "";
	if ($("#nameFilterInput").val().trim() != "") {
		filter += "[alt*='" + $("#nameFilterInput").val().toLowerCase() + "']";
	} else {
		filter = "*";
	}
	$('#themesTileContainer').isotope({
		filter : filter
	});
}

function themeSelected(selectedThemeId) {
	$.ajax("/decals/theme_show?id=" + selectedThemeId, {
		type : "get",
		dataType : "JSON"
	}).success(
			function(data) {
				// Set the canvas dimensions
				$("#decalCanvasContainer").css(
						{
							width : $('#wizardContainer').width() * 2 / 3,
							height : ($('#wizardContainer').width() * 2 / 3)
									* (210 / 297) // Keep A4 proportions
						});
				
				initStage();
				// Draw the theme image on a canvas
				var image = new Image();
				image.onload = function() {

					// Add theme image to canvas
					addImageToCanvas(image, 250, 250,
							$('#decalCanvasContainer').outerWidth() / 2 - 125,
							200, true, true, 10);
					showStep(2);
				};
				showBackgroundsTileView(data.backgrounds);
				image.src = "/assets/" + data.theme["file_url"];
			});
}

// Display background options for the selected theme
function showBackgroundsTileView(backgrounds) {
	// clean tile container before adding new elements
	clearBackgroundsContainer();
	// add backgrounds to the tile view
	for ( var i = 0; i < backgrounds.length; i++) {
		populateBackgroundTile(backgrounds[i]);
	}

	$(".theme-background-item").css("display", "inline");
	// Themes view layout manager
	$("#backgroundsTileContainer").isotope({
		// Options
		itemSelector : '.theme-background-item',
		layoutMode : 'cellsByColumn',
		cellsByColumn : {
			columnWidth : colW,
			rowHeight : rowH
		}
	});
}

function clearBackgroundsContainer() {
	if ($("#backgroundsTileContainer").hasClass('isotope')) {
		$("#backgroundsTileContainer").isotope("destroy");
	}
	$("#backgroundsTileContainer").empty();
}

function populateBackgroundTile(background) {
	var backgroundItem;
	$("#backgroundsTileContainer").append($("#backgroundItemWrapper").html());
	backgroundItem = $(".theme-background-item:last",
			$("#backgroundsTileContainer"));

	backgroundItem.click(function() {
		backgroundSelected(background.file_url);
	});
	$(".theme-background-img", backgroundItem).attr("src",
			"/assets/" + background.file_url);
}

function backgroundSelected(file_url) {
	var image = new Image();
	image.onload = function() {

		// Add theme image to canvas
		addImageToCanvas(image, $('#decalCanvasContainer').outerWidth(), $(
				'#decalCanvasContainer').outerHeight(), 0, 0, false, false, -10);
	};
	image.src = "/assets/" + file_url;
}

function renderThemesTileView() {
	$.ajax("/themes/list", {
		type : "get",
		dataType : "JSON"
	}).success(function(data) {
		// clean tile container before adding new elements
		clearThemesContainer();
		// ad themes to the tile view
		for ( var i = 0; i < data.length; i++) {
			populateThemeTile(data[i]);
		}

		$(".theme-item").css("display", "inline");
		// Themes view layout manager
		$("#themesTileContainer").isotope({
			// Options
			itemSelector : '.theme-item',
			layoutMode : 'cellsByRow',
			cellsByRow : {
				columnWidth : colW,
				rowHeight : rowH
			}
		});
	});
}

function clearThemesContainer() {
	if ($("#themesTileContainer").hasClass('isotope')) {
		$("#themesTileContainer").isotope("destroy");
	}
	$("#themesTileContainer").empty();
}

function populateThemeTile(theme) {
	var themeItem;
	$("#themesTileContainer").append($("#themeItemWrapper").html());
	themeItem = $(".theme-item:last", $("#themesTileContainer"));

	themeItem.attr({
		"alt" : theme.name.toLowerCase()
	});
	themeItem.click(function() {
		themeSelected(theme.id);
	});
	$(".theme-img", themeItem).attr("src", "/assets/" + theme.file_url);
}

function showStep(index) {
	$(".first-step").css("display", "none");
	$(".second-step").css("display", "none");
	$(".third-step").css("display", "none");
	$("li", ".breadcrumb").removeClass("active");
	switch (index) {
	case 1:
		$($("li", ".breadcrumb").get(2)).addClass("active");
		$(".first-step").fadeIn("500");
		break;
	case 2:
		$($("li", ".breadcrumb").get(1)).addClass("active");
		$(".second-step").fadeIn("500");
		break;
	case 3:
		$($("li", ".breadcrumb").get(0)).addClass("active");
		$(".third-step").fadeIn("500");
		break;
	}
}

function showWizard(skipAnimation) {
	showStep(1);
	// Load themes and render their tile view
	renderThemesTileView();
	var duration = (skipAnimation ? 0 : 500);
	$("#backgroundDiv").animate({
		// left: ["-2000","swing"],
		opacity : "0",
	}, duration, function() {
		$(".navbar").css("visibility", "visible");
		$("#wizardContainer").css("display", "block");
	});
	$("#welcomeRow").animate({
		// left: ["-2000","swing"],
		opacity : "0",
	}, duration, function() {
		$("#welcomeRow").css("display", "none");
	});

}

function drawCurvedText() {
	addCurvedTextToCanvas($("#curvedText").val(), 
			$("#curvedTextColor").val(),
			$("#curvedTextFont").val());
}

function drawYearsText() {
	addYearsTextToCanvas($("#yearsText").val(), 
			$("#yearsTextColor").val(),
			$("#yearsTextFont").val());
}

function saveDecal() {
	if (!window.current_user) {
		showSignup();
		return false;
	}
	removeAllAnchors();
	var $canvas = $("canvas", $("#decalCanvasContainer"));
	// save canvas image as data url (png format by default)
	var dataURL = $canvas.get(0).toDataURL();

	// Get our file
	var file = dataURLtoBlob(dataURL);
	// Create new form data
	var fd = new FormData();
	// Append our Canvas image file to the form data
	fd.append("image", file);
	fd.append("userId", window.current_user.id);
	// And send it
	$
			.ajax(
					{
						url : "/decals/save_img_file?authenticity_token="
								+ encodeURIComponent(window._token),
						data : fd,
						type : "POST",
						processData : false,
						contentType : false
					})
			.success(
					function(data) {
						// Move to the next wizard step
						showStep(3);
						$("#pinButton")
								.attr(
										"href",
										"http://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fwww.chompale.com&media="
												+ $(location).attr("protocol")
												+ "//"
												+ $(location).attr("host")
												+ "/uploads/"
												+ window.current_user.email
												+ "/"
												+ data.img_url
												+ "&description=Edible%20decal%20in%20Chompale.com");
						$("#socialShareDiv").append($(".fb-like"));
						$(".fb-like").css({visibility: 'visible'});
						$("#previewDecal").attr(
								"src",
								"/uploads/" + window.current_user.email + "/"
										+ data.img_url);
					});
}

// Convert dataURL to Blob object
function dataURLtoBlob(dataURL) {
	// Decode the dataURL
	var binary = atob(dataURL.split(',')[1]);
	// Create 8-bit unsigned array
	var array = [];
	for ( var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	// Return our Blob object
	return new Blob([ new Uint8Array(array) ], {
		type : 'image/png'
	});
}

function onPaymentSubmit() {
	$.ajax({
		url : "/decals/make_payment?remote=true&authenticity_token="
				+ encodeURIComponent(window._token),
		data : $("#payment-form").serialize(),
		format : 'json',
		type : "post",
		success : function(data) {
			$('.payment_submit').removeAttr("disabled");
			// Success code goes here
		},
		error : function() {
			$('.payment_submit').removeAttr("disabled");
			// Put your error code here
		}
	});
}

function showBackgrounds() {
	$("#textEditDiv").fadeOut(0);
	$("#backgroundsTileContainerWrapper").fadeIn(500);
}

function showTextEditor() {
	$("#backgroundsTileContainerWrapper").fadeOut(0);
	$("#textEditDiv").fadeIn(500);
}