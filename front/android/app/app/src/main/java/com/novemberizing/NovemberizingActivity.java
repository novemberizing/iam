package com.novemberizing;

import android.app.Activity;
import android.content.Intent;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;

/**
 * Default
 *
 *
 */
public class NovemberizingActivity {
    public static void move(Activity current, Class<? extends Activity> activity) {
        NovemberizingActivity.move(current, activity, true);
    }
    public static void move(Activity current, Class<? extends Activity> activity, Boolean finish) {
        Intent intent = new Intent(current, activity);
        current.startActivity(intent);
        if(finish) {
            current.finish();
        }
    }

    public static void linkify(TextView view, String str, View.OnClickListener listener) {
        String text = view.getText().toString();
        int start = text.indexOf(str);
        int end = start + str.length();

        ClickableSpan span = new ClickableSpan() {
            @Override
            public void updateDrawState(TextPaint paint) {
                paint.setUnderlineText(true);
            }

            @Override
            public void onClick(@NonNull View view) {
                listener.onClick(view);
            }
        };

        Spannable spannable = new SpannableString(text);
        spannable.setSpan(span, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

        view.setText(spannable);
        view.setMovementMethod(LinkMovementMethod.getInstance());
    }
}
