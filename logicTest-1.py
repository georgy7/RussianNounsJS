# -*- coding: utf-8 -*-

class LogicError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)

E = ['invalid value']

def check(a):
    for v in a:
        if (v not in [None, True, False]):
            raise LogicError(E[0])

##############################

def _not(x):
    check([x])
    if   (x == True):  return False
    elif (x == False): return True
    else: return None

def _void(x):
    check([x])
    if   (x == None):  return True
    else: return False

def _and(x,y):
    check([x,y])
    if   (x == False or y == False): return False
    elif (x == None or y == None): return None
    else: return True

def _or(x,y):
    check([x,y])
    if   (x == True or y == True): return True
    elif (x == None or y == None): return None
    else: return False

##############################

def _xor(x,y):
    check([x,y])
    return _and(_or(x,y), _not(_eq(x,y)))

def _then(x,y):
    """Удивительно, что эта загогулина работает.
    Дело в том, что для случаев, где один из аргументов = None,
    not(xor) работает почти также как and."""
    check([x,y])
    return _not(_xor( _or(_and(x, _not(_void(y))), None), y ))


def _eq(x,y):
    check([x,y])
    if   (x == None or y == None): return None
    elif (x == y): return True
    else: return False


def _then_0(x,y):
    check([x,y])
    if   (x == True and y == True): return True
    elif (x == True and y == False): return False
    else: return None



# TEST

#print _not(None), _not(True), _not(False)
#print _and(False, False), _and(False, None), _and(None, None), _and(True, None)


xy = [[True,  True,  True,  None,  None,  None,  False, False, False],
      [True,  None,  False, True,  None,  False, True,  None,  False]]

import pprint
pp = pprint.PrettyPrinter()

xy.append(map( _and, xy[0], xy[1] ))
xy.append(map( _or, xy[0], xy[1] ))
xy.append(map( _xor, xy[0], xy[1] ))
xy.append(map( _then, xy[0], xy[1] ))
#xy.append(map( _eq, xy[0], xy[1] ))

pp.pprint(xy)


