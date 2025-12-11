// Charles Sandmann wrote this MK_FP implementation.
// https://delorie.com/djgpp/v2faq/faq17_7.html

#include <sys/nearptr.h>
#include <crt0.h>

void * MK_FP (unsigned short seg, unsigned short ofs)
{
if ( !(_crt0_startup_flags & _CRT0_FLAG_NEARPTR) )
  if (!__djgpp_nearptr_enable ())
    return (void *)0;
return (void *) (seg*16 + ofs + __djgpp_conventional_base);
}

// -----------

// This code outputs a complete code page, including code points
// intersecting with control characters: 0x0A (◙), 0x0D (♪), etc.
// Neither the putch function, nor interrupt 21H, nor function 0Eh
// of interrupt 10H, does not allow this to be done.

#include <stdio.h>
#include <conio.h>

#define VIDEO_SEGMENT 0xB800

int main() {
    struct text_info info;
    gettextinfo(&info);

    printf("\n");

    for (int i = 0; i <= 0xF; i++) {
        printf("%X0\n", i);
    }

    int y = wherey();

    for (int i = 0; i <= 0xF; i++) {
        int lineNumber = y - 0x10 + i;
        if (lineNumber >= 1) {
            for (int j = 0; j <= 0xF; j++) {
                int offset = (lineNumber - 1) * (2 * info.screenwidth) + 2 * (4 + 2 * j);
                unsigned char * p = (unsigned char *) MK_FP(VIDEO_SEGMENT, offset);
                *p = (unsigned char) (0x10 * i + j);
            }
        }
    }

    return 0;
}

