package com.novemberizing.iam;

import static android.app.Activity.RESULT_OK;

import android.app.Activity;
import android.util.Log;
import android.widget.ImageView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.auth.api.identity.BeginSignInRequest;
import com.google.android.gms.auth.api.identity.Identity;
import com.google.android.gms.auth.api.identity.SignInClient;
import com.google.android.gms.auth.api.identity.SignInCredential;
import com.google.android.gms.common.api.ApiException;
import com.google.gson.JsonObject;
import com.novemberizing.function.NovemberizingOn;

public class NovemberizingIamGoogleLogin {
    private static final String Tag = "NovemberizingIamGoogle";
    private final ActivityResultLauncher<IntentSenderRequest> launcher;
    private final BeginSignInRequest request;
    private SignInClient client;
    private ImageView button;

    public void begin(Activity activity) {
        client.beginSignIn(request)
                .addOnSuccessListener(activity, result -> {
                    launcher.launch(new IntentSenderRequest.Builder(result.getPendingIntent().getIntentSender()).build());
                })
                .addOnFailureListener(activity, e -> {
                    Log.e(Tag, e.getMessage());
                });
    }

    public NovemberizingIamGoogleLogin(AppCompatActivity activity, ImageView image, String id, NovemberizingOn<JsonObject> callback) {
        launcher = activity.registerForActivityResult(new ActivityResultContracts.StartIntentSenderForResult(), result -> {
                    if (result.getResultCode() == RESULT_OK) {
                        try {
                            SignInCredential credential = client.getSignInCredentialFromIntent(result.getData());
                            // TODO: GOOGLE LOGIN WITH CUSTOM HEADER
                            // callback.on(credential);
                            NovemberizingIam.google(credential.getGoogleIdToken(), callback);

//                            const result = await axios.get(`http://localhost:40001/iam/signin`, { headers: { Authorization: `Google ${o.credential}` } });
//                            console.log(result.data);

                        } catch (ApiException e) {
                            Log.e(Tag, e.getMessage());
                        }
                    } else {
                        Log.e(Tag, "Result is not ok => " + result.getResultCode());
                    }
                });

        client = Identity.getSignInClient(activity);
        request = BeginSignInRequest.builder()
                .setPasswordRequestOptions(BeginSignInRequest.PasswordRequestOptions.builder()
                        .setSupported(true)
                        .build())
                .setGoogleIdTokenRequestOptions(BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
                        .setSupported(true)
                        // Your server's client ID, not your Android client ID.
                        .setServerClientId(id)
                        // Only show accounts previously used to sign in.
                        .setFilterByAuthorizedAccounts(true)
                        .build())
                // Automatically sign in when exactly one credential is retrieved.
                .setAutoSelectEnabled(true)
                .build();

        button = image;

        button.setOnClickListener(view -> begin(activity));
    }
}
