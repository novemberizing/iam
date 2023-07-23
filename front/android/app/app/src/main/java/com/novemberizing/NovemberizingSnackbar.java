package com.novemberizing;

import android.content.Context;
import android.view.View;

import com.google.android.material.snackbar.Snackbar;

public class NovemberizingSnackbar {
    public static void show(View view, CharSequence sequence){
        Snackbar.make(view, sequence, Snackbar.LENGTH_SHORT)
                .show();
    }
}
