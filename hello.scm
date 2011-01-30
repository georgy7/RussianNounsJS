;#lang r5rs
#lang scheme
(require scheme/mpair)
(require rnrs/lists-6)

;(require r5rs/init)
;(require srfi/1)

;(display "Hello World! Русский текст в UTF-8!")
;(newline)

; type: 0 - количественно-определенное, еще возможно сюда будут добавлены 
; порядковые (собирательные там вроде совсем иначе делаются)
; 0 <= number <= 999 (само число)
; 0 <= case <= 5 (падеж конструкции числительное+существительное)
; gender (род): 0 - женский, 1 - мужской, 2 - средний
; animacy (одушевленность): 0 - неодушевленное, 1 - одушевленное

;(define (vowel? s) 
;  (define vowels (list #\а #\е #\ё #\и #\о #\у #\ы #\э #\ю #\я))
;  (fold + 0 (map (λ (x) (if (equal? s x) 1 0) ) vowels)))

;(display (vowel? #\а))
;(display (vowel? #\б))


(define vowels (list #\а #\е #\ё #\и #\о #\у #\ы #\э #\ю #\я))
;(display (map (lambda (x) (if (equal? #\а x) 1 0) ) vowels))
;(define sdf (map (lambda (x) (if (equal? #\б x) 1 0) ) vowels))

;(define a (list 0 1))
;(fold + 0 '(2 3))
(fold-left + 0 (mlist 2 3))
(foldl + 0 '(2 3))
;(fold + 0 (list 2 3))

;(define (get-letter-position word n) 
;  (define charlist (string->list s))
;  )

; softness допустим 0 значит не определена, 1 значит твердое, 2 - мягкое, лол
; stress это номер ударной гласной. если 0, ее нет

; основа, ударение, склонение, мягкость последней согласной 
; перед окончанием, одушевленность, род, число, падеж
;               -     -       ок        -        бд     бд     x     x
(define (yoba stem stress declension softness animacy gender number case)
  (cond
    ((= declension 0) stem) ; несклоняемые существительные
    ((= declension 1) ; первое склонение. оно пиздец какое сложное, я нихуя не понял!
     (cond
       ((= number 0) ; единственное число
        (cond
          ((= gender 0) "error чтоле" )
          ((= gender 1) ; мужской род
           (cond
             ((= case 0) (string-append stem "a")) ; И
             ((= case 1) (string-append stem "a")) ; Р
             ((= case 2) (string-append stem "a")) ; Д
             ((= case 3) ; В
              (if (= animacy 1) 
                  (yoba stem stress declension softness animacy gender number 1) 
                  (yoba stem stress declension softness animacy gender number 0)))
             ((= case 4) (string-append stem "a")) ; Т
             ((= case 5) (string-append stem "a")))) ; П
          ((= gender 2) ; средний род
           (cond
             ((= case 0) (string-append stem "a"))
             ((= case 1) (string-append stem "a"))
             ((= case 2) (string-append stem "a"))
             ((= case 3) ; В
              (if (= animacy 1) 
                  (yoba stem stress declension softness animacy gender number 1) 
                  (yoba stem stress declension softness animacy gender number 0)))
             ((= case 4) (string-append stem "a"))
             ((= case 5) (string-append stem "a"))))))
       ((= number 1) "один")))
    
    ((= declension 2) ; тоже сложное дохуя
     "два")
    
    ((= declension 3) ; а вот это простое
     "три")))


; всё, что выше это линии - мусор
;-------------------------------

; что нужно хранить в базе (в плане существительных)
; - слово в именительном падеже
; - род
; - одушевленность
; - транскрипцию с ударением(опускать там, где можно динамически генернуть)
; - список несклоняемых слов

; заглушка (должно протоколироваться и возможно еще что-то делаться должно)
(define (errorlog str) (display (string-append "error: " str)))

(define (ending word n) 
  (cond ((> n (string-length word)) 
         (string-append (make-string (- n (string-length word)) #\space) word))
        ((< n 1) "")
        (else (substring word 
                         (- (string-length word) n) 
                         (string-length word)))))
  


(define (indeclinable? word) #f)

; это пока временная заглушка
; здесь должно пробиваться по списку в бд
; алсо, будем считать несклоняемыми, 
; все сущ-е обшего родая не знаю не на -а, -я
; чтобы упростить get-declension
; и большинство аббревиатур несклоняемые (кроме таких как "вуз", например)

(define (get-declension word gender)
  (if (indeclinable? word) 
      0
      (cond
        ((= gender 0) (cond ; feminine
                        ((or (equal? (ending word 1) "а") 
                             (equal? (ending word 1) "я")) 2)
                        (else 3))) ; случаи без окончания (мягкий знак там, все дела)
        ((= gender 1) (cond ; masculine
                        ((or (equal? (ending word 1) "а") 
                             (equal? (ending word 1) "я")) 2)
                        ((equal? word "путь") 4)
                        (else 1)))
        ((= gender 2) (cond ; neuter
                        ((equal? word "дитя") 4)
                        ((equal? (ending word 2) "мя") 3) ; можно выделить в 4
                        ;((or (equal? word "бремя") (equal? word "время") (equal? word "вымя")
                        ;     (equal? word "знамя") (equal? word "имя") (equal? word "племя")
                        ;     (equal? word "пламя") (equal? word "полымя") (equal? word "семя")
                        ;     (equal? word "стремя") (equal? word "темя")) 3)
                        (else 1)))
        ((= gender 3) 2)))) ; они все на -а, -я (которые нет - несклоняемые)


;--------

; тут первый аргумент - основа, а в get-declension - слово в именительном падеже
; второй аргумент - ударение, номер ударной гласной (если 0, то клитика, например, я пока не знаю)

;(display (yoba "доставлятор" 3 (get-declension "доставлятор" 1) 0 1 1 0 1))


;(define (yoba w d) 
;  (display  (string-append w " - " (number->string (get-declension w d)) " склонение"))
;  (newline))

;(yoba "пальто" 2)
;(yoba "забияка" 3)
;(yoba "кольт" 1)
;(yoba "веранда" 0)
;(yoba "пермь" 0)
;(yoba "путь" 1)

