<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px; /* Reduced font size for better fit */
            margin: 20px; /* Add some margin to the page */
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            table-layout: fixed; /* Ensures columns respect defined widths */
        }
        th, td {
            border: 1px solid #ddd;
            padding: 5px; /* Reduced padding */
            text-align: left;
            word-wrap: break-word; /* Allow long text to wrap */
        }
        th {
            background-color: #f2f2f2;
        }
        h1 {
            text-align: center;
            font-size: 20px; /* Slightly reduced header font size */
            margin-bottom: 10px;
        }
        p {
            text-align: center;
            margin-bottom: 20px;
        }

        /* Column Width Adjustments - Adjust as needed */
        table th:nth-child(1), table td:nth-child(1) { width: 10%; } /* TRX Transaksi */
        table th:nth-child(2), table td:nth-child(2) { width: 15%; } /* Nama Customer */
        table th:nth-child(3), table td:nth-child(3) { width: 15%; } /* Perusahaan */
        table th:nth-child(4), table td:nth-child(4) { width: 15%; } /* Produk */
        table th:nth-child(5), table td:nth-child(5) { width: 8%; }  /* Kuantitas */
        table th:nth-child(6), table td:nth-child(6) { width: 12%; } /* Total */
        table th:nth-child(7), table td:nth-child(7) { width: 8%; }  /* Status */
        table th:nth-child(8), table td:nth-child(8) { width: 9%; }  /* Created At */
        table th:nth-child(9), table td:nth-child(9) { width: 9%; }  /* Updated At */
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>Tanggal: {{ $date }}</p>

    <table>
        <thead>
            <tr>
                <th>TRX Transaksi</th>
                <th>Nama Customer</th>
                <th>Perusahaan</th>
                <th>Produk</th>
                <th>Kuantitas</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($reports as $report)
                <tr>
                    <td>{{ $report->trx }}</td>
                    <td>{{ $report->transaction->contact->name ?? 'N/A' }}</td>
                    <td>{{ $report->transaction->contact->company_name ?? 'N/A' }}</td>
                    <td>{{ $report->transaction->product->name ?? 'N/A' }}</td>
                    <td>{{ $report->qty }}</td>
                    <td>Rp{{ number_format(floatval($report->total), 0, ',', '.') }}</td>
                    <td>{{ $report->status ?? 'N/A' }}</td>
                    <td>{{ \Carbon\Carbon::parse($report->created_at)->format('d/m/Y H:i:s') }}</td>
                    <td>{{ \Carbon\Carbon::parse($report->updated_at)->format('d/m/Y H:i:s') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
