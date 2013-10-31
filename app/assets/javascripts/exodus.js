$(document).ready(function() {
	// Prevent the user from saving our images and edited canvas
	$('body').on('contextmenu', 'canvas', function(e) {
		return false;
	});
	$('body').on('contextmenu', 'img', function(e) {
		return false;
	});

	showWizard(true);
});

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

function filterThemes() {
	var filter = "";
	if ($("#nameFilterInput").val().trim() != "") {
		filter += "[alt*='" + $("#nameFilterInput").val().toLowerCase() + "']";
	} else {
		filter = "*";
	}
	$('#wall').isotope({
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
}

function clearBackgroundsContainer() {
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

		//$(".theme-item").css("display", "inline");
		// Themes view layout manager
		$("#wall").imagesLoaded(function() {
			applyIsotope();
		});
	});
}

function clearThemesContainer() {
	if ($("#wall").hasClass('isotope')) {
		$("#wall").isotope("destroy");
	}
	$("#wall").empty();
}

function populateThemeTile(theme) {
	var themeItem;
	$("#wall").append($("#themeItemWrapper").html());
	themeItem = $(".item:last", $("#wall"));

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

function showWizard() {
	showStep(1);

	$(".navbar").css("visibility", "visible");
	$("#wizardContainer").css("display", "block");
	// Load themes and render their tile view
	renderThemesTileView();
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