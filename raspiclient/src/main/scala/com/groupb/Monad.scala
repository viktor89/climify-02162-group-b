package com.groupb

case class Monad[C, A](g : C => A) {
  def apply(c : C) : A = {
    g(c)
  }

  def map[B](f : A => B) : Monad[C, B] = {
    c => {
      f(g(c))
    }
  }

  def flatMap[B](f : A => Monad[C, B]) : Monad[C, B] = {
    c => {
      f(g(c))(c)
    }
  }
}

def pure[A](a : A) : C => A = {
  c => {
    a
  }
}

implicit def monad[A, B](f : A => B) = Monad(f)
