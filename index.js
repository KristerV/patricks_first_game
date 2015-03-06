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
		} else if (e.keyCode == 13) {
			startGame()
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
	// heli                                   //
	sound_death = new Audio("sounds/death.wav")
	sound_game_over = new Audio("sounds/game_over.wav")
	sound_monster = new Audio("sounds/monster.wav")
	sound_monster_death = new Audio("sounds/monster_death.wav")
	sound_sword_hit = new Audio("sounds/sword_hit.wav")
	sound_sword_miss = new Audio("sounds/sword_miss.wav")
	sound_theme = new Audio("sounds/theme.mp3")
	sound_theme.play()

	////////////////////////////////////////////
	// Mängu aeg                              //
	score = 0
	window.timer = 0
	function startGame(){
		if (timer){
			 location.reload();
		}
		$(".instructions").remove()
		timer = setInterval(function(){
			gameTick()
		}, game_speed);
	}


	function gameTick(){

		console.log("-----------------------")

		var winWidth = $('html').width()
		var peaLeft = $(".peategelane").position().left
		var peaWidth = parseInt($(".peategelane").css("width"))-10
		var peaBottom = parseInt($(".peategelane").css("bottom"))

		movePeategelane(peaLeft)
		gameWon(winWidth,peaLeft,peaWidth)

		sound_monster_death
		$(".koll").each(function(index, item){
			keegiSureb(item,peaBottom,peaWidth,peaLeft)
			kolliLiikumine(item)
			kolliOutOfBounds(item)
			score+=1
		})
		slash = false
		kolliSpawner()
		gravity()
	}

	function  gameover() {
		clearTimeout(timer)
		sound_death.play()
		sound_game_over.play()
		if ($("h2").length == 0){
			$("body").append('<h2 class="gameover">GAME OVER!</h2>')
			$("body").append('<h2 class="gameover">SCORE: '+score+'</h2>')
			$("body").append('<h3 class="gameover">PRESS ENTER TO PLAY AGAIN</h3>')
			$(".gameover").slideDown("")
			$("body").addClass("back-red")
		}
	}

	function gameWon(winWidth,peaLeft,peaWidth){
		if (peaLeft>winWidth-peaWidth) {
			clearTimeout(1)
			if ($("h2").length == 0){
				$("body").append('<h2 class="gameover">GAME WON!</h2>')
				$("body").append('<h2 class="gameover">SCORE: '+score+'</h2>')
				$(".gameover").slideDown("")
				$("body").addClass("back-green")
			}
		}
	}

	function movePeategelane(peaLeft){
		$(".peategelane").css("left", peaLeft+(direction*peategelase_kiirus))
	
	}

	// Kas peategelane või hiir sureb
	// Antud juhul on "item" koll
	function keegiSureb(item,peaBottom,peaWidth,peaLeft) {

		// mis on kolli asukoht?
		var left = $(item).offset().left
		var bottom = parseInt($(item).css("bottom"))
		var width= parseInt($(item).css("width"))

		// Kui peategelase bottom on madalamal kui 41
		if (peaBottom<41 && bottom>0){

			// Kui mõõka just lajatati ja koll on raadiuses
			if (slash==true && peaLeft+peaWidth<left && peaLeft+peaWidth+slash_ulatus>left){
				$(item).css("bottom",-25)
				sound_sword_hit.play()
				sound_monster_death.play()
			// Kui mõõka ei lajatatud, aga peategelane sai kolliga pihta
			} else if (peaLeft<left && peaLeft+peaWidth>left){
				gameover()

			// Kui mõõka ei lajatatud, aga peategelane sai kolliga pihta
			} else if (peaLeft>left && peaLeft<left+width){
				gameover()

			// Kui mõõk lajatati aga mööda
			} else if (slash == true) {
				sound_sword_miss.play()
			}
		}
	}
	function kolliLiikumine(item) {
		var right = parseInt($(item).css("right"))
		var rand = Math.round(Math.random()*kolli_kiirus)
		$(item).css("right", right+rand)
	}
	function kolliOutOfBounds(item){
		if ($(item).offset().left<0) {
			$(item).remove()
		}
	}
	function kolliSpawner(){

		// Genereeri suvaline nr
		var rand = Math.round(Math.random()*(game_speed*0.7))

		// Kui suvaline number on 0
		if ($(".koll").length < amount_of_enemies && rand == 0) {

			// siis tekita koll
			$("body").append('<div class="koll tegelane"></div>')
			sound_monster.play()	
		}	

	}
	function gravity(){
		$(".tegelane").each(function(index, item){
			var bottom = parseInt($(item).css("bottom"))
			if (bottom>10){
				$(item).css("bottom", bottom-1)
			}
		})
	}
})

