package com.novemberizing.object;

public class NovemberizingPair<A, B> {
    public static <A, B> NovemberizingPair<A, B> gen(A first, B second) {
        return new NovemberizingPair<>(first, second);
    }
    private A first;
    private B second;

    public A first(){ return this.first; }
    public B second(){ return this.second; }

    public void first(A first){
        this.first = first;
    }

    public void second(B second) {
        this.second = second;
    }

    public NovemberizingPair() {
        this.first = null;
        this.second = null;
    }

    public NovemberizingPair(A first, B second) {
        this.first = first;
        this.second = second;
    }
}
