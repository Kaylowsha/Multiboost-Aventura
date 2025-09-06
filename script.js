// MULTIBOOST - ENTRENAMIENTO DE MULTIPLICACIONES
// Versión Compatible con limpieza automática - CORREGIDA

function MultiBoost() {
    // Estado de la aplicación
    this.currentScreen = 'welcome';
    this.selectedTables = [];
    this.exerciseCount = 10;
    this.currentExercise = 0;
    this.exercises = [];
    this.answers = [];
    this.timer = null;
    this.timeLeft = 10;
    this.totalTime = 0;
    this.sessionStartTime = null;
    this.sessionTimer = null;
    this.lastCorrectPosition = -1;
    // Modo Aventura
this.adventureMode = localStorage.getItem('adventureMode') === 'true';
this.userId = localStorage.getItem('userId');
this.practiceTable = localStorage.getItem('practiceTable');
this.practiceExercises = localStorage.getItem('practiceExercises');

    // Modo Desafío
this.challengeMode = localStorage.getItem('challengeMode') === 'true';
this.challengeCode = localStorage.getItem('challengeCode');
this.challengeTable = localStorage.getItem('challengeTable');
this.challengeExercises = localStorage.getItem('challengeExercises');
this.participantName = localStorage.getItem('participantName');
this.participantType = localStorage.getItem('participantType');
    
    // Estadísticas
    this.stats = {
        correct: 0,
        incorrect: 0,
        mistakes: []
    };

    // Inicializar la aplicación
    this.init();
}

// Inicialización
MultiBoost.prototype.init = function() {
    var self = this;
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            self.bindEvents();
            
            // Saltar directo a ejercicios si es práctica específica o desafío
            if (self.adventureMode && self.practiceTable && self.practiceExercises) {
                self.autoStartSpecificPractice();
            } else if (self.challengeMode && self.challengeTable && self.challengeExercises) {
                self.autoStartChallenge();
            } else {
                self.showScreen('welcome');
            }
            console.log('🚀 MultiBoost iniciado correctamente');
        });
    } else {
        this.bindEvents();
        
        // Saltar directo a ejercicios si es práctica específica o desafío
        if (this.adventureMode && this.practiceTable && this.practiceExercises) {
            this.autoStartSpecificPractice();
        } else if (this.challengeMode && this.challengeTable && this.challengeExercises) {
            this.autoStartChallenge();
        } else {
            this.showScreen('welcome');
        }
        console.log('🚀 MultiBoost iniciado correctamente');
    }
};
// Vincular eventos de los botones
MultiBoost.prototype.bindEvents = function() {
    var self = this;

    // Validar que los elementos existen
    try {
        // Botón de inicio
        var startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                self.showScreen('config');
            });
        }

        // Botones de selección de tablas
        var tableBtns = document.querySelectorAll('.table-btn');
        for (var i = 0; i < tableBtns.length; i++) {
            tableBtns[i].addEventListener('click', function(e) {
                self.toggleTable(e.target || e.srcElement);
            });
        }

        // Botones rápidos
        var selectAllBtn = document.getElementById('select-all-btn');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function() {
                self.selectAllTables();
            });
        }

        var clearAllBtn = document.getElementById('clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function() {
                self.clearAllTables();
            });
        }

        var surpriseBtn = document.getElementById('surprise-btn');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', function() {
                self.surpriseSelection();
            });
        }

        // Botones de cantidad de ejercicios
        var exerciseBtns = document.querySelectorAll('.exercise-btn');
        for (var i = 0; i < exerciseBtns.length; i++) {
            exerciseBtns[i].addEventListener('click', function(e) {
                self.selectExerciseCount(e.target || e.srcElement);
            });
        }

        // Botón iniciar entrenamiento
        var startTrainingBtn = document.getElementById('start-training-btn');
        if (startTrainingBtn) {
            startTrainingBtn.addEventListener('click', function() {
                self.startTraining();
            });
        }

        // Botones de opciones en ejercicios
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].addEventListener('click', function(e) {
                self.selectAnswer(e.target || e.srcElement);
            });
        }

        // Botones de resultados
        var repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            repeatBtn.addEventListener('click', function() {
                self.repeatTraining();
            });
        }

        var newTrainingBtn = document.getElementById('new-training-btn');
        if (newTrainingBtn) {
            newTrainingBtn.addEventListener('click', function() {
                self.newTraining();
            });
        }
        // Vincular botón de entrenamiento específico
           this.bindSpecificTrainingButton();
        // Botones de cantidad en interfaz específica
var specificExerciseBtns = document.querySelectorAll('#specific-practice-config .exercise-btn');
for (var i = 0; i < specificExerciseBtns.length; i++) {
    specificExerciseBtns[i].addEventListener('click', function(e) {
        // Remover active de todos
        var allSpecificBtns = document.querySelectorAll('#specific-practice-config .exercise-btn');
        for (var j = 0; j < allSpecificBtns.length; j++) {
            allSpecificBtns[j].classList.remove('active');
        }
        // Añadir active al clickeado
        (e.target || e.srcElement).classList.add('active');
        self.exerciseCount = parseInt((e.target || e.srcElement).getAttribute('data-count'));
    });
}
    } catch (error) {
        console.log('Error vinculando eventos:', error);
    }
};

// Mostrar pantalla específica
MultiBoost.prototype.showScreen = function(screenName) {
    try {
        // Ocultar todas las pantallas
        var screens = document.querySelectorAll('.screen');
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }

        // Mostrar la pantalla solicitada
        var targetScreen = document.getElementById(screenName + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('📺 Mostrando pantalla: ' + screenName);
        }
        // Configurar interfaz específica si viene del dashboard
if (screenName === 'config' && this.adventureMode && this.practiceTable) {
    this.setupSpecificPracticeInterface();
}
    } catch (error) {
        console.log('Error mostrando pantalla:', error);
    }
};

// CONFIGURACIÓN - Seleccionar/deseleccionar tabla
MultiBoost.prototype.toggleTable = function(btn) {
    try {
        var table = parseInt(btn.getAttribute('data-table'));
        
        if (btn.classList.contains('selected')) {
            // Deseleccionar
            btn.classList.remove('selected');
            this.selectedTables = this.selectedTables.filter(function(t) {
                return t !== table;
            });
        } else {
            // Seleccionar
            btn.classList.add('selected');
            this.selectedTables.push(table);
        }

        this.updateStartButton();
        console.log('📊 Tablas seleccionadas:', this.selectedTables);
    } catch (error) {
        console.log('Error seleccionando tabla:', error);
    }
};

// Seleccionar todas las tablas
MultiBoost.prototype.selectAllTables = function() {
    try {
        var tableBtns = document.querySelectorAll('.table-btn');
        for (var i = 0; i < tableBtns.length; i++) {
            tableBtns[i].classList.add('selected');
        }
        this.selectedTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.updateStartButton();
        console.log('✅ Todas las tablas seleccionadas');
    } catch (error) {
        console.log('Error seleccionando todas las tablas:', error);
    }
};

// Limpiar selección de tablas
MultiBoost.prototype.clearAllTables = function() {
    try {
        var tableBtns = document.querySelectorAll('.table-btn');
        for (var i = 0; i < tableBtns.length; i++) {
            tableBtns[i].classList.remove('selected');
        }
        this.selectedTables = [];
        this.updateStartButton();
        console.log('❌ Tablas deseleccionadas');
    } catch (error) {
        console.log('Error deseleccionando tablas:', error);
    }
};

// Selección sorpresa
MultiBoost.prototype.surpriseSelection = function() {
    try {
        this.clearAllTables();
        
        var allTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        var surpriseCount = Math.floor(Math.random() * 3) + 1;
        
        for (var i = 0; i < surpriseCount; i++) {
            var randomIndex = Math.floor(Math.random() * allTables.length);
            var randomTable = allTables.splice(randomIndex, 1)[0];
            
            this.selectedTables.push(randomTable);
            var btn = document.querySelector('[data-table="' + randomTable + '"]');
            if (btn) {
                btn.classList.add('selected');
            }
        }
        
        this.updateStartButton();
        console.log('🎲 Selección sorpresa:', this.selectedTables);
    } catch (error) {
        console.log('Error en selección sorpresa:', error);
    }
};

// Seleccionar cantidad de ejercicios
MultiBoost.prototype.selectExerciseCount = function(btn) {
    try {
        var exerciseBtns = document.querySelectorAll('.exercise-btn');
        for (var i = 0; i < exerciseBtns.length; i++) {
            exerciseBtns[i].classList.remove('active');
        }
        
        btn.classList.add('active');
        this.exerciseCount = parseInt(btn.getAttribute('data-count'));
        
        console.log('🎯 Ejercicios seleccionados:', this.exerciseCount);
    } catch (error) {
        console.log('Error seleccionando ejercicios:', error);
    }
};

// Actualizar estado del botón de inicio
MultiBoost.prototype.updateStartButton = function() {
    try {
        var startBtn = document.getElementById('start-training-btn');
        if (!startBtn) return;
        
        if (this.selectedTables.length > 0) {
            startBtn.disabled = false;
            startBtn.textContent = '💪 ¡INICIAR ENTRENAMIENTO!';
        } else {
            startBtn.disabled = true;
            startBtn.textContent = '⚠️ Selecciona al menos una tabla';
        }
    } catch (error) {
        console.log('Error actualizando botón:', error);
    }
};

// ENTRENAMIENTO - Iniciar sesión de ejercicios
MultiBoost.prototype.startTraining = function() {
    try {
        console.log('🚀 Iniciando entrenamiento...');
        console.log('📊 Tablas:', this.selectedTables);
        console.log('🎯 Ejercicios:', this.exerciseCount);
// Configurar para práctica específica si viene del dashboard
if (this.adventureMode && this.practiceTable && this.practiceExercises) {
    this.selectedTables = [parseInt(this.practiceTable)];
    this.exerciseCount = parseInt(this.practiceExercises);
    console.log('🎯 Modo práctica específica: Tabla del ' + this.practiceTable + ' con ' + this.practiceExercises + ' ejercicios');
}
        // LIMPIEZA AUTOMÁTICA ANTES DE EMPEZAR
        this.cleanupSession();
        
        this.resetStats();
        this.generateExercises();
        
        this.sessionStartTime = new Date().getTime();
        this.startSessionTimer();
        
        this.currentExercise = 0;
        this.showNextExercise();
        this.showScreen('exercise');
    } catch (error) {
        console.log('Error iniciando entrenamiento:', error);
    }
};

// Generar ejercicios (CON PROTECCIÓN ANTI-BUCLES)
MultiBoost.prototype.generateExercises = function() {
    try {
        console.log('📝 Generando ejercicios...');
        this.exercises = [];
        
        if (this.selectedTables.length === 0) {
            console.log('❌ Error: No hay tablas seleccionadas');
            return;
        }
        
        for (var i = 0; i < this.exerciseCount; i++) {
            console.log('📝 Generando ejercicio ' + (i + 1) + '/' + this.exerciseCount);
            
            // Elegir tabla aleatoria de las seleccionadas
            var table = this.selectedTables[Math.floor(Math.random() * this.selectedTables.length)];
            
            // Generar multiplicando aleatorio (1-10)
            var multiplicand = Math.floor(Math.random() * 10) + 1;
            
            // Crear ejercicio
            var exercise = {
                table: table,
                multiplicand: multiplicand,
                question: table + ' × ' + multiplicand + ' = ?',
                correctAnswer: table * multiplicand
            };
            
            console.log('➡️ Ejercicio creado:', exercise.question, '=', exercise.correctAnswer);
            
            // Generar opciones de respuesta
            exercise.options = this.generateOptions(exercise.correctAnswer);
            
            this.exercises.push(exercise);
            
            // Log cada 10 ejercicios para ver progreso
            if ((i + 1) % 10 === 0) {
                console.log('✅ Progreso: ' + (i + 1) + '/' + this.exerciseCount + ' ejercicios generados');
            }
        }
        
        console.log('✅ TODOS los ejercicios generados:', this.exercises.length);
    } catch (error) {
        console.log('❌ Error crítico generando ejercicios:', error);
        // Crear ejercicios de emergencia
        this.exercises = [{
            table: 2,
            multiplicand: 3,
            question: '2 × 3 = ?',
            correctAnswer: 6,
            options: [6, 5, 7, 8]
        }];
    }
};

// Generar opciones de respuesta (SIN BUCLES INFINITOS)
MultiBoost.prototype.generateOptions = function(correctAnswer) {
    try {
        var options = [correctAnswer];
        var attempts = 0;
        var maxAttempts = 20; // LÍMITE DE INTENTOS
        
        // Opción 1: Suma de dígitos
        var sumOption = this.getSumOfDigits(correctAnswer);
        if (sumOption !== correctAnswer && sumOption > 0) {
            options.push(sumOption);
        }
        
        // Generar opciones restantes con límite de intentos
        while (options.length < 4 && attempts < maxAttempts) {
            var wrongAnswer;
            var variance = Math.floor(Math.random() * 15) + 1; // Mayor rango
            
            if (Math.random() > 0.5) {
                wrongAnswer = correctAnswer + variance;
            } else {
                wrongAnswer = Math.max(1, correctAnswer - variance);
            }
            
            // Agregar si es único y válido
            if (options.indexOf(wrongAnswer) === -1 && wrongAnswer > 0 && wrongAnswer < 200) {
                options.push(wrongAnswer);
            }
            
            attempts++;
        }
        
        // Si aún faltan opciones, usar fórmula fija
        while (options.length < 4) {
            var fallbackOption = correctAnswer + options.length;
            if (options.indexOf(fallbackOption) === -1) {
                options.push(fallbackOption);
            } else {
                options.push(correctAnswer + options.length + 10);
            }
        }
        
        console.log('✅ Opciones generadas:', options);
        return this.shuffleOptionsSmartly(options, correctAnswer);
        
    } catch (error) {
        console.log('Error generando opciones:', error);
        // Fallback seguro
        return [correctAnswer, correctAnswer + 1, correctAnswer + 2, correctAnswer + 3];
    }
};

// Suma de dígitos
MultiBoost.prototype.getSumOfDigits = function(number) {
    try {
        return number.toString().split('').reduce(function(sum, digit) {
            return sum + parseInt(digit);
        }, 0);
    } catch (error) {
        return number + 1;
    }
};

// Mezclar array
MultiBoost.prototype.shuffleArray = function(array) {
    try {
        var shuffled = array.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    } catch (error) {
        return array;
    }
};
// NUEVA FUNCIÓN: SHUFFLE INTELIGENTE
MultiBoost.prototype.shuffleOptionsSmartly = function(options, correctAnswer) {
    try {
        // Mezclar normalmente primero
        var shuffled = this.shuffleArray(options);
        
        // Encontrar posición de la respuesta correcta después del shuffle
        var newCorrectIndex = shuffled.indexOf(correctAnswer);
        
        // Si es el primer ejercicio, cualquier posición está bien
        if (this.lastCorrectPosition === -1) {
            this.lastCorrectPosition = newCorrectIndex;
            console.log('🎯 Primera respuesta correcta en posición:', newCorrectIndex);
            return shuffled;
        }
        
        // Si la nueva posición es igual a la anterior, reorganizar
        if (newCorrectIndex === this.lastCorrectPosition) {
            console.log('⚠️ Misma posición detectada. Reorganizando...');
            
            // Buscar una posición diferente disponible
            var availablePositions = [];
            for (var i = 0; i < 4; i++) {
                if (i !== this.lastCorrectPosition) {
                    availablePositions.push(i);
                }
            }
            
            // Elegir una posición aleatoria de las disponibles
            var newPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            
            // Intercambiar elementos
            var temp = shuffled[newPosition];
            shuffled[newPosition] = shuffled[newCorrectIndex];
            shuffled[newCorrectIndex] = temp;
            
            console.log('🔄 Respuesta correcta movida de posición', newCorrectIndex, 'a posición', newPosition);
            this.lastCorrectPosition = newPosition;
        } else {
            // La posición ya es diferente, guardarla
            this.lastCorrectPosition = newCorrectIndex;
            console.log('✅ Respuesta correcta en nueva posición:', newCorrectIndex);
        }
        
        return shuffled;
        
    } catch (error) {
        console.log('Error en shuffle inteligente:', error);
        // Si hay error, usar el método anterior
        this.lastCorrectPosition = -1;
        return this.shuffleArray(options);
    }
};
// Mostrar siguiente ejercicio
MultiBoost.prototype.showNextExercise = function() {
    try {
        if (this.currentExercise >= this.exercises.length) {
            this.showResults();
            return;
        }

        var exercise = this.exercises[this.currentExercise];
        
        var questionEl = document.getElementById('exercise-question');
        if (questionEl) {
            questionEl.textContent = exercise.question;
        }

        var progressTextEl = document.getElementById('progress-text');
        if (progressTextEl) {
            progressTextEl.textContent = 'Ejercicio ' + (this.currentExercise + 1) + ' de ' + this.exercises.length;
        }
        
        var progressPercentage = ((this.currentExercise) / this.exercises.length) * 100;
        var progressFillEl = document.getElementById('progress-fill');
        if (progressFillEl) {
            progressFillEl.style.width = progressPercentage + '%';
        }
        
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length && i < exercise.options.length; i++) {
            optionBtns[i].textContent = exercise.options[i];
            optionBtns[i].setAttribute('data-answer', exercise.options[i]);
            optionBtns[i].className = 'option-btn';
            optionBtns[i].disabled = false;
            optionBtns[i].style.background = '';
            optionBtns[i].style.color = '';
            optionBtns[i].style.borderColor = '';
        }

        this.startExerciseTimer();
        console.log('📝 Ejercicio ' + (this.currentExercise + 1) + ':', exercise.question);
    } catch (error) {
        console.log('Error mostrando ejercicio:', error);
    }
};

// Timer de ejercicio
MultiBoost.prototype.startExerciseTimer = function() {
    var self = this;
    
    try {
        this.timeLeft = 10;
        this.updateTimerDisplay();
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(function() {
            self.timeLeft--;
            self.updateTimerDisplay();
            
            if (self.timeLeft <= 0) {
                clearInterval(self.timer);
                self.timeOut();
            }
        }, 1000);
    } catch (error) {
        console.log('Error con timer:', error);
    }
};

// Actualizar display del timer
MultiBoost.prototype.updateTimerDisplay = function() {
    try {
        var timerEl = document.getElementById('timer-display');
        if (!timerEl) return;
        
        timerEl.textContent = this.timeLeft;
        timerEl.className = 'timer';
        
        if (this.timeLeft <= 3) {
            timerEl.className += ' danger';
        } else if (this.timeLeft <= 5) {
            timerEl.className += ' warning';
        }
    } catch (error) {
        console.log('Error actualizando timer:', error);
    }
};

// Timer de sesión
MultiBoost.prototype.startSessionTimer = function() {
    var self = this;
    
    try {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        this.sessionTimer = setInterval(function() {
            var elapsed = Math.floor((new Date().getTime() - self.sessionStartTime) / 1000);
            var minutes = Math.floor(elapsed / 60);
            var seconds = elapsed % 60;
            
            var timeEl = document.getElementById('total-time');
            if (timeEl) {
                var minStr = minutes < 10 ? '0' + minutes : minutes.toString();
                var secStr = seconds < 10 ? '0' + seconds : seconds.toString();
                timeEl.textContent = minStr + ':' + secStr;
            }
        }, 1000);
    } catch (error) {
        console.log('Error con timer de sesión:', error);
    }
};

// Seleccionar respuesta
MultiBoost.prototype.selectAnswer = function(btn) {
    var self = this;
    
    try {
        if (btn.disabled) return;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        var selectedAnswer = parseInt(btn.getAttribute('data-answer'));
        var correctAnswer = this.exercises[this.currentExercise].correctAnswer;
        
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].disabled = true;
        }
        
        btn.classList.add('selected');
        
        if (selectedAnswer === correctAnswer) {
            btn.classList.add('correct');
            this.stats.correct++;
            this.playCorrectSound();
            console.log('✅ Respuesta correcta!');
        } else {
            btn.classList.add('incorrect');
            this.stats.incorrect++;
            
            for (var i = 0; i < optionBtns.length; i++) {
                if (parseInt(optionBtns[i].getAttribute('data-answer')) === correctAnswer) {
                    optionBtns[i].classList.add('correct');
                }
            }
            
            this.stats.mistakes.push({
                question: this.exercises[this.currentExercise].question,
                userAnswer: selectedAnswer,
                correctAnswer: correctAnswer
            });
            
            this.playIncorrectSound();
            console.log('❌ Respuesta incorrecta');
        }
        
        this.updateStatsDisplay();
        
        setTimeout(function() {
            self.currentExercise++;
            self.showNextExercise();
        }, 1500);
    } catch (error) {
        console.log('Error seleccionando respuesta:', error);
    }
};

// Tiempo agotado
MultiBoost.prototype.timeOut = function() {
    var self = this;
    
    try {
        console.log('⏰ Tiempo agotado');
        var correctAnswer = this.exercises[this.currentExercise].correctAnswer;
        
        this.stats.incorrect++;
        
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].disabled = true;
            if (parseInt(optionBtns[i].getAttribute('data-answer')) === correctAnswer) {
                optionBtns[i].classList.add('correct');
            }
        }
        
        this.stats.mistakes.push({
            question: this.exercises[this.currentExercise].question,
            userAnswer: 'Sin respuesta (tiempo agotado)',
            correctAnswer: correctAnswer
        });
        
        this.updateStatsDisplay();
        this.playIncorrectSound();
        
        setTimeout(function() {
            self.currentExercise++;
            self.showNextExercise();
        }, 1500);
    } catch (error) {
        console.log('Error en timeout:', error);
    }
};

// Actualizar estadísticas
MultiBoost.prototype.updateStatsDisplay = function() {
    try {
        var correctEl = document.getElementById('correct-count');
        if (correctEl) {
            correctEl.textContent = this.stats.correct;
        }

        var incorrectEl = document.getElementById('incorrect-count');
        if (incorrectEl) {
            incorrectEl.textContent = this.stats.incorrect;
        }
    } catch (error) {
        console.log('Error actualizando estadísticas:', error);
    }
};

// Mostrar resultados
MultiBoost.prototype.showResults = function() {
    try {
        console.log('🏁 Entrenamiento completado');
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        var totalExercises = this.stats.correct + this.stats.incorrect;
        var percentage = Math.round((this.stats.correct / totalExercises) * 100);
        var finalTime = Math.floor((new Date().getTime() - this.sessionStartTime) / 1000);
        
        var elements = {
            'final-correct': this.stats.correct,
            'final-incorrect': this.stats.incorrect,
            'final-percentage': percentage + '%'
        };
        
        for (var id in elements) {
            var el = document.getElementById(id);
            if (el) {
                el.textContent = elements[id];
            }
        }
        
        var minutes = Math.floor(finalTime / 60);
        var seconds = finalTime % 60;
        var timeEl = document.getElementById('final-time');
        if (timeEl) {
            var minStr = minutes < 10 ? '0' + minutes : minutes.toString();
            var secStr = seconds < 10 ? '0' + seconds : seconds.toString();
            timeEl.textContent = minStr + ':' + secStr;
        }
        
        var resultsTitle = document.getElementById('results-title');
        if (resultsTitle) {
            if (percentage >= 80) {
                resultsTitle.textContent = '🎉 ¡EXCELENTE ENTRENAMIENTO!';
                resultsTitle.style.color = '#10b981';
                this.playCelebrationSound();
            } else if (percentage >= 60) {
                resultsTitle.textContent = '👍 ¡BUEN TRABAJO!';
                resultsTitle.style.color = '#f59e0b';
            } else {
                resultsTitle.textContent = '💪 ¡SIGUE PRACTICANDO!';
                resultsTitle.style.color = '#f97316';
            }
        }
        
        this.showMistakesReview();
        this.configureResultsButtons(percentage);
 // Guardar en Firebase si está en Modo Aventura
if (this.adventureMode && this.userId) {
    this.saveSessionToFirebase();
}

// Guardar resultado del desafío
if (this.challengeMode && this.challengeCode) {
    this.saveChallengeResult();
}

        this.showScreen('results');


    } catch (error) {
        console.log('Error mostrando resultados:', error);
    }
};

// Mostrar errores
MultiBoost.prototype.showMistakesReview = function() {
    try {
        var mistakesContainer = document.getElementById('mistakes-review');
        if (!mistakesContainer) return;
        
        if (this.stats.mistakes.length === 0) {
            mistakesContainer.style.display = 'none';
            return;
        }
        
        mistakesContainer.style.display = 'block';
        
        var html = '<h3 style="color: #ef4444; margin-bottom: 15px;">📋 Revisión de Errores:</h3>';
        
        for (var i = 0; i < this.stats.mistakes.length; i++) {
            var mistake = this.stats.mistakes[i];
            html += '<div style="background: white; padding: 10px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ef4444;">';
            html += '<strong>' + mistake.question + '</strong><br>';
            html += '<span style="color: #ef4444;">Tu respuesta: ' + mistake.userAnswer + '</span><br>';
            html += '<span style="color: #10b981;">Respuesta correcta: ' + mistake.correctAnswer + '</span>';
            html += '</div>';
        }
        
        mistakesContainer.innerHTML = html;
    } catch (error) {
        console.log('Error mostrando errores:', error);
    }
};

// Configurar botones de resultados - VERSIÓN ACTUALIZADA
MultiBoost.prototype.configureResultsButtons = function(percentage) {
    try {
        // Configurar botones según el modo
        if (this.challengeMode && this.challengeCode) {
            // MODO DESAFÍO
            document.getElementById('repeat-challenge-btn').style.display = 'inline-block';
            document.getElementById('show-mistakes-btn').style.display = 'inline-block';
            document.getElementById('repeat-btn').style.display = 'none';
            document.getElementById('new-training-btn').style.display = 'none';
            
         // Configurar botón home según usuario
            var homeBtn = document.getElementById('home-btn');
            if (this.participantType === 'logged') {
                homeBtn.textContent = '🏠 Volver al Dashboard';
                homeBtn.onclick = function() { window.location.href = 'dashboard.html'; };
            } else {
                homeBtn.textContent = '🏠 Volver al Inicio';
                homeBtn.onclick = function() { window.location.href = 'index.html'; };
            }
        } else {
            // MODO NORMAL
            var repeatBtn = document.getElementById('repeat-btn');
            if (repeatBtn) {
                if (percentage < 80) {
                    repeatBtn.style.display = 'inline-block';
                    repeatBtn.textContent = '🔄 Repetir Entrenamiento';
                } else {
                    repeatBtn.style.display = 'none';
                }
            }
            
            document.getElementById('repeat-challenge-btn').style.display = 'none';
            document.getElementById('show-mistakes-btn').style.display = 'none';
        }
    } catch (error) {
        console.log('Error configurando botones:', error);
    }
};
// Repetir entrenamiento
MultiBoost.prototype.repeatTraining = function() {
    try {
        console.log('🔄 Repitiendo entrenamiento...');
        this.cleanupSession();
        this.startTraining();
    } catch (error) {
        console.log('Error repitiendo:', error);
    }
};

// Nuevo entrenamiento
MultiBoost.prototype.newTraining = function() {
    try {
        console.log('🚀 Nuevo entrenamiento');
        this.cleanupSession();
        this.showScreen('config');
    } catch (error) {
        console.log('Error nuevo entrenamiento:', error);
    }
};

// LIMPIEZA COMPLETA DE SESIÓN - ¡LA CLAVE DEL ARREGLO!
MultiBoost.prototype.cleanupSession = function() {
    try {
        console.log('🧹 Limpiando sesión...');
        
        // Limpiar todos los timers
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        // Resetear estado
        this.currentExercise = 0;
        this.exercises = [];
        this.timeLeft = 10;
        this.sessionStartTime = null;
        
        // Limpiar interfaz de ejercicios
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
           optionBtns[i].className = 'option-btn';
           optionBtns[i].disabled = false;
           optionBtns[i].textContent = '';
           optionBtns[i].style.background = '';
           optionBtns[i].style.color = '';
           optionBtns[i].style.borderColor = '';
        }
        
        // Resetear timer visual
        var timerEl = document.getElementById('timer-display');
        if (timerEl) {
            timerEl.textContent = '10';
            timerEl.className = 'timer';
        }
        
        // Resetear barra de progreso
        var progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        
        // Resetear tiempo total
        var totalTimeEl = document.getElementById('total-time');
        if (totalTimeEl) {
            totalTimeEl.textContent = '00:00';
        }
        this.lastCorrectPosition = -1;
        console.log('✅ Sesión completamente limpia');
    } catch (error) {
        console.log('Error limpiando sesión:', error);
    }
};

// Resetear estadísticas
MultiBoost.prototype.resetStats = function() {
    this.stats = {
        correct: 0,
        incorrect: 0,
        mistakes: []
    };
    this.updateStatsDisplay();
};

// Sonidos simulados
MultiBoost.prototype.playCorrectSound = function() {
    console.log('🔊 ♪ Sonido: Respuesta correcta');
};

MultiBoost.prototype.playIncorrectSound = function() {
    console.log('🔊 ♪ Sonido: Respuesta incorrecta');
};

MultiBoost.prototype.playCelebrationSound = function() {
    console.log('🔊 ♪ Sonido: ¡Celebración!');
};
// Guardar sesión en Firebase
MultiBoost.prototype.saveSessionToFirebase = function() {
    var self = this;
    
    try {
        if (!window.db || !window.doc || !window.setDoc) {
            console.log('Firebase no disponible, modo público');
            return;
        }

        console.log('💾 Guardando sesión en Firebase...');

        var totalExercises = this.stats.correct + this.stats.incorrect;
        var percentage = Math.round((this.stats.correct / totalExercises) * 100);
        var finalTime = Math.floor((new Date().getTime() - this.sessionStartTime) / 1000);

        // Datos de la sesión
        var sessionData = {
            date: new Date().toISOString(),
            tables: this.selectedTables,
            exerciseCount: this.exerciseCount,
            correct: this.stats.correct,
            incorrect: this.stats.incorrect,
            percentage: percentage,
            totalTime: finalTime,
            mistakes: this.stats.mistakes,
            practiceTable: this.practiceTable || null,
            mode: this.practiceTable ? 'specific' : 'general'
        };

        // Generar ID único para la sesión
        var sessionId = 'session_' + Date.now();

        // Guardar sesión en Firestore
        window.setDoc(window.doc(window.db, 'sessions', this.userId + '_' + sessionId), sessionData)
            .then(function() {
                console.log('✅ Sesión guardada exitosamente');
                self.updateUserProgress(percentage);
            })
            .catch(function(error) {
                console.error('Error guardando sesión:', error);
            });

    } catch (error) {
        console.error('Error en saveSessionToFirebase:', error);
    }
};

// Actualizar progreso del usuario
MultiBoost.prototype.updateUserProgress = function(sessionPercentage) {
    var self = this;
    
    try {
        // Obtener progreso actual
        window.getDoc(window.doc(window.db, 'progress', this.userId))
            .then(function(docSnapshot) {
                var currentProgress = docSnapshot.exists() ? docSnapshot.data() : {
                    tables: {},
                    totalSessions: 0
                };

                // Actualizar progreso por tabla
                for (var i = 0; i < self.selectedTables.length; i++) {
                    var table = self.selectedTables[i];
                    
                    if (!currentProgress.tables[table]) {
                        currentProgress.tables[table] = { accuracy: 0, sessions: 0 };
                    }

                    var tableData = currentProgress.tables[table];
                    var newAccuracy = Math.round(((tableData.accuracy * tableData.sessions) + sessionPercentage) / (tableData.sessions + 1));
                    
                    currentProgress.tables[table] = {
                        accuracy: newAccuracy,
                        sessions: tableData.sessions + 1
                    };
                }

                // Actualizar sesiones totales
                currentProgress.totalSessions = (currentProgress.totalSessions || 0) + 1;
                currentProgress.lastUpdated = new Date().toISOString();

                // Guardar progreso actualizado
                return window.setDoc(window.doc(window.db, 'progress', self.userId), currentProgress);
            })
            .then(function() {
                console.log('✅ Progreso actualizado exitosamente');
            })
            .catch(function(error) {
                console.error('Error actualizando progreso:', error);
            });

    } catch (error) {
        console.error('Error en updateUserProgress:', error);
    }
};
// Configurar interfaz para práctica específica
MultiBoost.prototype.setupSpecificPracticeInterface = function() {
    try {
        // Ocultar configuración normal y mostrar específica
        document.getElementById('normal-config').style.display = 'none';
        document.getElementById('specific-practice-config').style.display = 'block';
        
        // Actualizar título con la tabla específica
        document.getElementById('specific-table-title').textContent = '🎯 Practicando Tabla del ' + this.practiceTable;
        
        // Pre-configurar la tabla seleccionada
        this.selectedTables = [parseInt(this.practiceTable)];
        
        // Configurar cantidad si viene predefinida
        if (this.practiceExercises) {
            this.exerciseCount = parseInt(this.practiceExercises);
        }
        
        console.log('🎯 Interfaz específica configurada para tabla del ' + this.practiceTable);
    } catch (error) {
        console.log('Error configurando interfaz específica:', error);
    }
};

// Vincular evento del botón específico
MultiBoost.prototype.bindSpecificTrainingButton = function() {
    var self = this;
    var specificBtn = document.getElementById('start-specific-training-btn');
    if (specificBtn) {
        specificBtn.addEventListener('click', function() {
            self.startTraining();
        });
    }
};
// Auto-iniciar práctica específica
MultiBoost.prototype.autoStartSpecificPractice = function() {
    try {
        console.log('🚀 Auto-iniciando práctica específica para tabla del ' + this.practiceTable);
        
        // Configurar automáticamente
        this.selectedTables = [parseInt(this.practiceTable)];
        this.exerciseCount = parseInt(this.practiceExercises);
        
        // Limpiar sesión e inicializar
        this.cleanupSession();
        this.resetStats();
        this.generateExercises();
        
        // Iniciar timers
        this.sessionStartTime = new Date().getTime();
        this.startSessionTimer();
        
        // Ir directo a ejercicios
        this.currentExercise = 0;
        this.showNextExercise();
        this.showScreen('exercise');
        
        console.log('✅ Práctica específica iniciada automáticamente');
    } catch (error) {
        console.log('Error en auto-inicio:', error);
        // Si falla, usar flujo normal
        this.showScreen('welcome');
    }
};
// Auto-iniciar desafío
MultiBoost.prototype.autoStartChallenge = function() {
    try {
        console.log('🏆 Auto-iniciando desafío ' + this.challengeCode);
        
        // Configurar automáticamente
        this.selectedTables = [parseInt(this.challengeTable)];
        this.exerciseCount = parseInt(this.challengeExercises);
        
        // Limpiar sesión e inicializar
        this.cleanupSession();
        this.resetStats();
        this.generateExercises();
        
        // Iniciar timers
        this.sessionStartTime = new Date().getTime();
        this.startSessionTimer();
        
        // Ir directo a ejercicios
        this.currentExercise = 0;
        this.showNextExercise();
        this.showScreen('exercise');
        
        console.log('✅ Desafío iniciado automáticamente');
    } catch (error) {
        console.log('Error en auto-inicio desafío:', error);
        this.showScreen('welcome');
    }
};
// Guardar resultado del desafío - VERSIÓN CON DEBUG MEJORADO
MultiBoost.prototype.saveChallengeResult = function() {
    var self = this;
    
    try {
        // Verificar que estamos en modo desafío
        if (!this.challengeMode || !this.challengeCode) {
            console.log('❌ No estamos en modo desafío');
            return;
        }

        // Verificar que Firebase esté disponible
        if (!window.db || !window.doc || !window.updateDoc || !window.arrayUnion) {
            console.log('❌ Firebase no disponible. Verificando...');
            console.log('db:', !!window.db);
            console.log('doc:', !!window.doc);
            console.log('updateDoc:', !!window.updateDoc);
            console.log('arrayUnion:', !!window.arrayUnion);
            return;
        }

        console.log('💾 Guardando resultado del desafío...');
        console.log('🏆 Código del desafío:', this.challengeCode);
        console.log('👤 Participante:', this.participantName);

        var totalExercises = this.stats.correct + this.stats.incorrect;
        var percentage = Math.round((this.stats.correct / totalExercises) * 100);
        var finalTime = Math.floor((new Date().getTime() - this.sessionStartTime) / 1000);

        var resultData = {
            name: this.participantName,
            score: percentage,
            time: finalTime,
            type: this.participantType || 'guest',
            timestamp: new Date().toISOString()
        };

        console.log('📊 Datos a guardar:', resultData);

        // Actualizar el documento del desafío añadiendo el resultado
        window.updateDoc(window.doc(window.db, 'challenges', this.challengeCode), {
            results: window.arrayUnion(resultData)
        }).then(function() {
            console.log('✅ Resultado del desafío guardado exitosamente');
            console.log('🔄 Redirigiendo a ranking en 3 segundos...');
            
          // En lugar de redireccionar, cargar ranking aquí
if (self.challengeMode && self.challengeCode) {
    self.loadChallengeRanking();
}
        }).catch(function(error) {
            console.error('❌ Error guardando resultado del desafío:', error);
            console.error('Detalles del error:', error.message);
            
            // Si falla, al menos mostrar que completó el desafío
            alert('Desafío completado, pero hubo un problema guardando el resultado. Código: ' + self.challengeCode);
        });

    } catch (error) {
        console.error('❌ Error crítico en saveChallengeResult:', error);
    }
};
// Función para volver al inicio
window.goToHome = function() {
    console.log('Navegando al inicio desde tablas');
    // Si está en Modo Aventura, volver al dashboard
    if (localStorage.getItem('adventureMode') === 'true') {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
};

// Inicializar MultiBoost
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.multiBoost = new MultiBoost();
        });
    } else {
        window.multiBoost = new MultiBoost();
    }
    // Cargar ranking del desafío para mostrar en resultados
MultiBoost.prototype.loadChallengeRanking = function() {
    var self = this;
    
    try {
        if (!window.db || !window.doc || !window.getDoc) {
            console.log('Firebase no disponible para ranking');
            return;
        }

        console.log('📊 Cargando ranking del desafío...');

        window.getDoc(window.doc(window.db, 'challenges', this.challengeCode))
            .then(function(docSnapshot) {
                if (docSnapshot.exists()) {
                    var challengeData = docSnapshot.data();
                    self.displayChallengeRanking(challengeData.results || []);
                } else {
                    console.log('Desafío no encontrado');
                }
            })
            .catch(function(error) {
                console.error('Error cargando ranking:', error);
            });

    } catch (error) {
        console.error('Error en loadChallengeRanking:', error);
    }
};

// Mostrar el ranking en la pantalla de resultados
MultiBoost.prototype.displayChallengeRanking = function(results) {
    try {
        // Ordenar resultados por score y tiempo
        var sortedResults = results.sort(function(a, b) {
            if (b.score !== a.score) return b.score - a.score;
            return a.time - b.time;
        });

        var rankingContainer = document.getElementById('challenge-ranking-container');
        if (!rankingContainer) return;

        var html = '<h3 style="color: #6b46c1; margin-bottom: 15px; text-align: center;">🏆 RANKING ACTUALIZADO</h3>';
        
        if (sortedResults.length === 0) {
            html += '<div style="text-center; opacity: 0.6;">Sé el primero en participar</div>';
        } else {
            for (var i = 0; i < sortedResults.length; i++) {
                var result = sortedResults[i];
                var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.';
                var userType = result.type === 'logged' ? '👤' : '👻';
                var isCurrentUser = result.name === this.participantName;
                var highlightClass = isCurrentUser ? 'background: rgba(255, 215, 0, 0.3); border: 2px solid gold;' : '';
                
                var minutes = Math.floor(result.time / 60);
                var seconds = result.time % 60;
                var timeStr = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
                
                html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; background: white; border-radius: 8px; ' + highlightClass + '">';
                html += '<div style="display: flex; align-items: center; gap: 10px; color: #374151;">';
                html += '<span style="font-size: 1.2rem; font-weight: bold;">' + medal + '</span>';
                html += '<span style="font-weight: bold;">' + result.name + '</span>';
                html += '<span style="font-size: 0.8rem; opacity: 0.6;">' + userType + '</span>';
                if (isCurrentUser) html += '<span style="color: gold; font-weight: bold;">← TÚ</span>';
                html += '</div>';
                html += '<div style="text-align: right; color: #374151;">';
                html += '<div style="font-weight: bold; color: #10b981;">' + result.score + '%</div>';
                html += '<div style="font-size: 0.8rem; opacity: 0.6;">' + timeStr + '</div>';
                html += '</div>';
                html += '</div>';
            }
        }
        
        rankingContainer.innerHTML = html;
        rankingContainer.style.display = 'block';
        
        console.log('✅ Ranking mostrado correctamente');
    } catch (error) {
        console.error('Error mostrando ranking:', error);
    }
};
// Repetir desafío específico
MultiBoost.prototype.repeatChallenge = function() {
    try {
        console.log('🔄 Repitiendo desafío...');
        this.cleanupSession();
        this.startTraining();
    } catch (error) {
        console.log('Error repitiendo desafío:', error);
    }
};

// Mostrar errores en modal
MultiBoost.prototype.showMistakesModal = function() {
    try {
        var mistakesContainer = document.getElementById('mistakes-review');
        if (mistakesContainer && mistakesContainer.style.display === 'none') {
            mistakesContainer.style.display = 'block';
            document.getElementById('show-mistakes-btn').textContent = '❌ Ocultar Errores';
        } else {
            mistakesContainer.style.display = 'none';
            document.getElementById('show-mistakes-btn').textContent = '📋 Ver Mis Errores';
        }
    } catch (error) {
        console.log('Error mostrando errores:', error);
    }
};
// Vincular eventos de nuevos botones
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var repeatChallengeBtn = document.getElementById('repeat-challenge-btn');
        if (repeatChallengeBtn) {
            repeatChallengeBtn.addEventListener('click', function() {
                if (window.multiBoost) window.multiBoost.repeatChallenge();
            });
        }
        
        var showMistakesBtn = document.getElementById('show-mistakes-btn');
        if (showMistakesBtn) {
            showMistakesBtn.addEventListener('click', function() {
                if (window.multiBoost) window.multiBoost.showMistakesModal();
            });
        }
    }, 1000);
});
})();
