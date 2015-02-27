$(function(){
	amount_of_enemies=5
	game_speed=20
	kolli_kiirus = 7
	slash_ulatus = 30
	peategelase_kiirus = 3

	////////////////////////////////////////////
	// nupu vajutused                         //

	direction = 0
	slash = false
	$('body').keydown(function(e) {
		if (e.keyCode == 37) { // vasak nupp
			direction = -1
		} else if (e.keyCode == 39) { // parem nupp
			direction = 1
		} else if (e.keyCode == 38) { // üles nupp
			var bottom = parseInt($(".peategelane").css("bottom"))
			if (bottom == 10){
				$(".peategelane").animate({"bottom": "60px"})
			}
		} else if (e.keyCode == 32) { // tühik
			slash = true
			$(".peategelane").addClass("slash")
		}
	})
	$('body').keyup(function(e) {

		if (e.keyCode == 37 || e.keyCode == 39) { // vasak nupp
			direction = 0
		} else if (e.keyCode == 32) { // tühik
			slash = false
			$(".peategelane").removeClass("slash")
		}
	})

	////////////////////////////////////////////
	// Mängu aeg                              //
	score = 0
	window.timer = setInterval(function(){
		console.log("-----------------------")
		var winWidth = $('html').width()

		// Move left-right
		var peaLeft = $(".peategelane").position().left
		var peaWidth = parseInt($(".peategelane").css("width"))-10
		var peaBottom = parseInt($(".peategelane").css("bottom"))
		$(".peategelane").css("left", peaLeft+(direction*peategelase_kiirus))

		// Game Won
		if (peaLeft>winWidth-peaWidth){
			gameWon()
		}

		// kolli loogika
		$(".koll").each(function(index, item){
			
			// surm
			var left = $(item).offset().left
			var bottom = parseInt($(item).css("bottom"))
			var width= parseInt($(item).css("width"))
			if (peaBottom<41 && bottom>0){
				if (slash==true && peaLeft+peaWidth<left && peaLeft+peaWidth+slash_ulatus>left){
					$(item).css("bottom",-25)
				} else if (peaLeft<left && peaLeft+peaWidth>left){
					gameover()
				} else if (peaLeft>left && peaLeft<left+width){
					gameover()
				}
			}

			// kolli liikumine
			var right = parseInt($(item).css("right"))
			var rand = Math.round(Math.random()*kolli_kiirus)
			$(item).css("right", right+rand)

			// Kolli out of bounds
			if ($(item).offset().left<0) {
				$(item).remove()
			}

			score+=1
		})
		slash = false

		// kolli spawner
		var rand = Math.round(Math.random()*(game_speed*0.7))
		if ($(".koll").length < amount_of_enemies && rand == 0) {
			$("body").append('<div class="koll tegelane"></div>')
		}

		// gravity
		$(".tegelane").each(function(index, item){
			var bottom = parseInt($(item).css("bottom"))
			if (bottom>10){
				$(item).css("bottom", bottom-1)
			}
		})


	}, game_speed);

	function  gameover() {
		clearTimeout(1)
		if ($("h2").length == 0){
			$("body").append('<h2 class="gameover">GAME OVER!</h2>')
			$("body").append('<h2 class="gameover">SCORE: '+score+'</h2>')
			$(".gameover").slideDown("")
			$("body").addClass("back-red")
		}
	}

	function gameWon(){
		clearTimeout(1)
		if ($("h2").length == 0){
			$("body").append('<h2 class="gameover">GAME WON!</h2>')
			$("body").append('<h2 class="gameover">SCORE: '+score+'</h2>')
			$(".gameover").slideDown("")
			$("body").addClass("back-green")
		}
	}

})