package com.groupb

case class Monad[A, B](g : A => B) {
  def apply(a : A) = g(a)
  def map[C](f : B => C) : Monad[A, C] =
    Monad(a => f(g(a)))
  def flatMap[C](f : B => Monad[A, C]) : Monad[A, C] =
    Monad(a => f(g(a))(a))
}
