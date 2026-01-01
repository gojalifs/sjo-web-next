
# Android Retrofit Guide for PDF Generation API

This guide explains how to consume your Next.js PDF generation endpoint (`POST /api/pdf`) in an Android application using Retrofit.

## 1. Dependencies

Add these to your `build.gradle` (Module: app):

```gradle
dependencies {
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
}
```

## 2. Data Models

Create Kotlin data classes that match your API's JSON body.

```kotlin
data class InvoiceRequest(
    val receiptNo: String,
    val receivedFrom: String,
    val patientName: String,
    val optometrist: String,
    val items: List<InvoiceItem>,
    val totalAmount: Int,
    val amountInWords: String,
    val location: String,
    val date: String,
    val receiver: String
)

data class InvoiceItem(
    val label: String,
    val details: String,
    val amount: Int
)
```

## 3. Retrofit Interface

Define the API endpoint. **Important**: Use `@Streaming` because you are downloading a file. This prevents Retrofit from loading the entire file into memory at once.

```kotlin
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Streaming

interface PdfApiService {
    @Streaming
    @POST("api/pdf")
    suspend fun generatePdf(@Body request: InvoiceRequest): Response<ResponseBody>
}
```

## 4. Helper Function to Save File

Since the API returns a raw ByteStream (the PDF), you need a helper to write it to the Android storage.

```kotlin
import okhttp3.ResponseBody
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.io.OutputStream

fun saveFileToDisk(body: ResponseBody, path: File): Boolean {
    return try {
        var inputStream: InputStream? = null
        var outputStream: OutputStream? = null

        try {
            val fileReader = ByteArray(4096)
            var fileSizeDownloaded: Long = 0

            inputStream = body.byteStream()
            outputStream = FileOutputStream(path)

            while (true) {
                val read = inputStream.read(fileReader)
                if (read == -1) {
                    break
                }
                outputStream.write(fileReader, 0, read)
                fileSizeDownloaded += read
            }
            outputStream.flush()
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        } finally {
            inputStream?.close()
            outputStream?.close()
        }
    } catch (e: Exception) {
        e.printStackTrace()
        false
    }
}
```

## 5. Usage Example (ViewModel/CoroutineScope)

Here is how you call the API and handle the download.

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class PdfViewModel : ViewModel() {

    private val api: PdfApiService by lazy {
        Retrofit.Builder()
            .baseUrl("http://YOUR_SERVER_IP:3000/") // Use 10.0.2.2 for Android Emulator
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PdfApiService::class.java)
    }

    fun downloadInvoice(context: android.content.Context) {
        val request = InvoiceRequest(
            receiptNo = "TRANS-001",
            receivedFrom = "Budi",
            patientName = "Siti",
            optometrist = "Dr. Andi",
            items = listOf(
                InvoiceItem("Frame", "Rayban", 1500000),
                InvoiceItem("Lensa", "Blue Ray", 500000)
            ),
            totalAmount = 2000000,
            amountInWords = "Dua Juta Rupiah",
            location = "Jakarta",
            date = "20 Dec 2025",
            receiver = "Admin"
        )

        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = api.generatePdf(request)
                
                if (response.isSuccessful && response.body() != null) {
                    // Create a file in the app's cache or files directory
                    val file = File(context.getExternalFilesDir(null), "invoice-${request.receiptNo}.pdf")
                    
                    val isSaved = saveFileToDisk(response.body()!!, file)
                    
                    withContext(Dispatchers.Main) {
                        if (isSaved) {
                            println("File saved at: ${file.absolutePath}")
                            // TODO: Open PDF or notify user
                        } else {
                            println("Failed to save file")
                        }
                    }
                } else {
                    val errorBody = response.errorBody()?.string()
                    println("Error: $errorBody")
                }
            } catch (e: Exception) {
                e.printStackTrace()
                // Handle network error
            }
        }
    }
}
```

## 6. Validation Errors

If your request is invalid (e.g. missing fields), the API returns a **400 Bad Request**. You can parse `response.errorBody()` to see the specific validation errors.

```json
{
  "error": "Validation failed",
  "details": {
    "patientName": {
      "_errors": ["Patient name is required"]
    }
  }
}
```
