package com.novemberizing.iam.application;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textview.MaterialTextView;
import com.novemberizing.NovemberizingSnackbar;
import com.novemberizing.iam.NovemberizingIam;
import com.novemberizing.iam.NovemberizingIamGoogleLogin;

public class NovemberizingSignupDefaultActivity extends AppCompatActivity {
    private static final String Tag = "LoginDefaultActivity";
    private Button signup;

    private TextInputEditText userid;
    private TextInputEditText email;
    private TextInputEditText password;
    private TextInputEditText confirm;
    private TextInputEditText name;
    private TextInputEditText birthday;
    private TextInputEditText gender;
    private TextInputEditText profile;
    private MaterialTextView optional;
    private LinearLayout layout;

    private NovemberizingIamGoogleLogin google;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup_default);

        signup = findViewById(R.id.activity_signup_default_signup_button);


        userid = findViewById(R.id.activity_signup_default_userid_edit);
        email = findViewById(R.id.activity_signup_default_email_edit);
        password = findViewById(R.id.activity_signup_default_password_edit);
        confirm = findViewById(R.id.activity_signup_default_confirm_edit);
        name = findViewById(R.id.activity_signup_default_name_edit);
        birthday = findViewById(R.id.activity_signup_default_birthday_edit);
        gender = findViewById(R.id.activity_signup_default_gender_edit);
        profile = findViewById(R.id.activity_signup_default_profile_edit);
        optional = findViewById(R.id.activity_signup_default_optional_text);
        layout = findViewById(R.id.activity_signup_default_optional_root_layout);

        optional.setOnClickListener(view -> {
            if(layout.getVisibility() == View.VISIBLE) {
                layout.setVisibility(View.GONE);
            } else if(layout.getVisibility() == View.GONE) {
                layout.setVisibility(View.VISIBLE);
            }
        });

        google = new NovemberizingIamGoogleLogin(this, findViewById(R.id.activity_signup_default_social_google_image), getString(R.string.default_web_client_id), o -> {
            Log.e(Tag, o.toString());

            NovemberizingSnackbar.show(findViewById(R.id.activity_signup_default_layout), "Succeed to google signup");
        });

        signup.setOnClickListener(view -> NovemberizingIam.signup(userid, email, password, confirm, name, birthday, gender, profile, o -> {
            Log.e(Tag, o.toString());
            NovemberizingSnackbar.show(findViewById(R.id.activity_signup_default_layout), "Succeed to signup");
        }));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        signup = null;
        google = null;
        optional = null;
    }
}
