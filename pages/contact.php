<?php
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

// Empfänger (DEINE Mail!)
$to = "business@katharinakay.com";

// Betreff
$subject = "Neue Kontaktanfrage";

// Nachricht
$body = "Name: $name\nE-Mail: $email\n\nNachricht:\n$message";

// Header
$headers = "From: $email";

// Mail senden
mail($to, $subject, $body, $headers);

// Antwort
echo "Danke $name, deine Nachricht wurde gesendet!";
?>